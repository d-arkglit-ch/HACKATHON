// 📁 routes/api.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ✅ Import models from separate files
import Assignment from "../models/assignments.js";
import Class from "../models/class.js";
import Submission from "../models/submission.js";

const router = express.Router();

// ✅ Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Ensure uploads directory exists
const uploadPath = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// // ✅ Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() }); // PDF stored in memory as Buffer


// ✅ Create a New Class
// ✅ Create a New Class (Updated with subject & semester)
router.post("/classes", async (req, res) => {
  try {
    const { name, subject, semester } = req.body;

    const newClass = new Class({
      name,
      subject,
      semester,
      code: uuidv4()
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get All Classes
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a Class
router.delete("/classes/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "✅ Class deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete class." });
  }
});

// ✅ Create a New Assignment
// router.post("/assignments", async (req, res) => {
//   try {
//     const { classId, title, description, fileUrl, dueDate, teacherId } = req.body;
//     console.log(fileUrl);
//     const newAssignment = new Assignment({ classId, title, description, fileUrl, dueDate, teacherId });
//     console.log(newAssignment);
//     await newAssignment.save();
//     console.log("ok3");
//     res.status(201).json(newAssignment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    const { title, description, dueDate, classId, teacherId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      classId,
      teacherId,
      fileData: {
        data: req.file.buffer,
        contentType: req.file.mimetype, // should be 'application/pdf'
      },
    });

    await newAssignment.save();
    res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }


});


// ✅ Get Assignments for a Specific Class
router.get("/assignments/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const classInfo = await Class.findById(classId);
    if (!classInfo) return res.status(404).json({ error: "Class not found" });

    const assignments = await Assignment.find({ classId }).sort({ createdAt: -1 });
    const recentAssignments = assignments.slice(0, 5);
    const oldAssignments = assignments.slice(5);

    res.json({
      className: classInfo.name,
      newAssignments: recentAssignments,
      oldAssignments: oldAssignments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete an Assignment
router.delete("/assignments/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "✅ Assignment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete assignment." });
  }
});

// ✅ Submit an Assignment
router.post("/submissions", async (req, res) => {
  try {
    const { assignmentId, studentName, fileUrl } = req.body;
    const newSubmission = new Submission({ assignmentId, studentName, fileUrl });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Submissions for an Assignment
router.get("/submissions/:assignmentId", async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Provide Feedback
router.post("/submissions/:submissionId/feedback", async (req, res) => {
  try {
    const { feedback, grade } = req.body;
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    submission.feedback = feedback;
    submission.grade = grade;
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Submission
router.delete("/submissions/:id", async (req, res) => {
  try {
    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
    if (!deletedSubmission) return res.status(404).json({ error: "Submission not found" });
    res.json({ message: "✅ Submission deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete submission." });
  }
});

// ✅ Upload Endpoint
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// ✅ Serve Static Files
router.use("/uploads", express.static(uploadPath));

export default router;
