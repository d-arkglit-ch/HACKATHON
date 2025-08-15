// 📁 routes/api.js
// routes/apiRoutes.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { requireAuth } from "../config/auth.js"; // ✅ Import auth middleware
// ✅ Import models
import Assignment from "../models/assignments.js";
import Class from "../models/class.js";
import Submission from "../models/submission.js";
import { analyzePdfWithAzure } from "../utils/azureVision.js";
import { getGeminiFeedback } from "../utils/gemeniApi.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadPath = path.join(__dirname, "../uploads");
const upload = multer({ storage: multer.memoryStorage() });

// -------------------- Class Routes --------------------
router.post("/classes", async (req, res) => {
  try {
    const { name, department, subject, semester, teacherId } = req.body;
    if (!name || !department || !subject) {
      return res.status(400).json({ error: "Name, department, and subject are required" });
    }
    const newClass = new Class({ name, department, subject, semester, teacherId, code: uuidv4() });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/classes/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "✅ Class deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete class." });
  }
});

// -------------------- Assignment Routes --------------------
router.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    const { title, description, dueDate, classId, teacherId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      classId,
      teacherId,
      fileData: { data: req.file.buffer, contentType: req.file.mimetype },
    });

    await newAssignment.save();
    await Class.findByIdAndUpdate(classId, { $push: { assignments: newAssignment._id } }, { new: true });

    res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/assignments/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const classInfo = await Class.findById(classId);
    if (!classInfo) return res.status(404).json({ error: "Class not found" });

    const assignments = await Assignment.find({ classId }).sort({ createdAt: -1 });
    const recentAssignments = assignments.slice(0, 5);
    const oldAssignments = assignments.slice(5);

    res.json({ className: classInfo.name, newAssignments: recentAssignments, oldAssignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/assignments/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "✅ Assignment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete assignment." });
  }
});

// -------------------- Submission Routes --------------------
router.post("/submissions", upload.single("file"), async (req, res) => {
  try {
    const { assignmentId, studentId, content } = req.body;
    const submission = new Submission({
      assignmentId,
      studentId,
      content,
      file: req.file ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname
      } : undefined,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/submissions/:id/analyze", async (req, res) => {
  try {
    console.log("🧠 Starting analysis for submission:", req.params.id);

    const submission = await Submission.findById(req.params.id).populate("assignmentId");
    const buffer = submission.assignmentId.fileData?.data;

    if (!buffer) throw new Error("No PDF buffer found");

    console.log("📤 Sending to Azure OCR...");
    const ocrText = await analyzePdfWithAzure(buffer);
    console.log("📄 Extracted text from PDF:", ocrText);
    console.log("🔗 Generating public URL...");
    const pdfUrl = `http://localhost:5001/api/assignments/${submission.assignmentId._id}/file`;

    console.log("🤖 Calling Gemini...");
const feedback = await getGeminiFeedback(ocrText, pdfUrl);

if (!feedback) {
  console.error("⚠️ No feedback received from Gemini. Returning fallback response.");
  return res.status(500).json({ error: "AI feedback generation failed." });
}

console.log("📩 Final feedback:", feedback);
submission.feedback = feedback.summary;
submission.marks = feedback.marks;

await submission.save();

res.json({
  message: "Feedback generated",
  summary: feedback.summary,
  marks: feedback.marks,
});

   } catch (err) {
    console.error("❌ AI analysis error:", err);
    res.status(500).json({ error: "Failed to analyze submission" });
  }
});

router.get("/submissions/:assignmentId", async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate("studentId", "name email");
    res.json(submissions.map(sub => ({
      _id: sub._id,
      studentName: sub.studentId?.name || "Unknown",
      reviewed: sub.feedbacks?.length > 0,
      fileUrl: `/api/submissions/${sub._id}/file`
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/submissions/:id/file", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission || !submission.file || !submission.file.data) {
      return res.status(404).json({ error: "File not found" });
    }
    res.set("Content-Type", submission.file.contentType || "application/pdf");
    res.set("Content-Disposition", `inline; filename=\"${submission.file.fileName || 'submission.pdf'}\"`);
    res.send(submission.file.data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/submissions/:submissionId/feedback", requireAuth, async (req, res) => {
  try {
    console.log("Received feedback for submission:");
    const { feedbackText, score } = req.body;

    const teacherId = req.user._id; // Assuming user ID is set in req.user by auth middleware
console.log(teacherId)
    console.log("Received feedback:", { feedbackText, score , teacherId });
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    submission.feedbacks.push({ feedbackText, score, teacherId });
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/submissions/:id", async (req, res) => {
  try {
    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
    if (!deletedSubmission) return res.status(404).json({ error: "Submission not found" });
    res.json({ message: "✅ Submission deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete submission." });
  }
});

// -------------------- Static File Serving --------------------
router.use("/uploads", express.static(uploadPath));

export default router;
