// routes/assignmentRoutes.js
import express from "express";
import Assignment from "../models/assignments.js";

const router = express.Router();

// ✅ Get all assignments for a given class
router.get("/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch assignments sorted by creation date (latest first)
    const assignments = await Assignment.find({ classId }).sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    res.status(500).json({ error: "Server error while fetching assignments" });
  }
});

// ✅ Export the router as default
export default router;
