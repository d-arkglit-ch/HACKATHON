// routes/submissionRoutes.js
// routes/submissionRoutes.js
import express from "express";
import mongoose from "mongoose";
import Submission from "../models/submission.js";

const router = express.Router();

// ✅ Get all submissions for an assignment
router.get("/:assignmentId", async (req, res) => {
  console.log("Fetching submissions for assignment:", req.params.assignmentId);
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    const formatted = submissions.map((sub) => ({
      _id: sub._id,
      studentName: sub.studentId?.name || "Unknown",
      reviewed: sub.feedbacks.length > 0,
      fileUrl: `/submissions/${sub._id}/file`
    }));
console.log("Formatted submission data:", formatted);

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ✅ Serve the uploaded file
router.get("/:id/file", async (req, res) => {
  console.log("Serving file for submission ID:", req.params.id);
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission || !submission.file?.data) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set({
      "Content-Type": submission.file.contentType,
      "Content-Disposition": `inline; filename=\"${submission.file.fileName}\"`
    });

    res.send(submission.file.data);
  } catch (err) {
    console.error("❌ Error serving file:", err);
    res.status(500).json({ error: "Failed to open file" });
  }
});

// ✅ Submit feedback
router.post("/:id/feedback", async (req, res) => {
  try {
    const { feedbackText, score = null, teacherId } = req.body;

    if (!feedbackText || !teacherId) {
      return res.status(400).json({ error: "Missing feedback or teacherId" });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    submission.feedbacks.push({ teacherId, feedbackText, score });
    await submission.save();

    res.json({ message: "Feedback added" });
  } catch (err) {
    console.error("❌ Error submitting feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});


export default router;
