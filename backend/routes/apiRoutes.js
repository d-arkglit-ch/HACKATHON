import express from "express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import multer from "multer";  // ✅ Import Multer for file uploads
import path from "path";  // ✅ Import Path module
import { fileURLToPath } from "url";  // ✅ Required for __dirname in ES Modules

const router = express.Router();

// // ✅ Models
// const Class = mongoose.model(
//   "Class",
//   new mongoose.Schema({
//     name: String,
//     code: { type: String, unique: true },
//   })
// );

// const Assignment = mongoose.model(
//   "Assignment",
//   new mongoose.Schema({
//     classId: String,
//     title: String,
//     description: String,
//     fileUrl: String,
//     dueDate: Date,
//   })
// );

// const Submission = mongoose.model(
//   "Submission",
//   new mongoose.Schema({
//     assignmentId: String,
//     studentName: String,
//     fileUrl: String,
//     feedback: String,
//     grade: String,
//   })
// );

// ✅ Create a New Class
router.post("/classes", async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name, code: uuidv4() });
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
router.post("/assignments", async (req, res) => {
  try {
    const { classId, title, description, fileUrl, dueDate } = req.body;
    const newAssignment = new Assignment({ classId, title, description, fileUrl, dueDate });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Assignments for a Specific Class
router.get("/assignments/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;

    // ✅ Fetch the class name
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: "Class not found" });
    }

    // ✅ Get assignments sorted by latest first
    const assignments = await Assignment.find({ classId }).sort({ createdAt: -1 });

    // ✅ Separate new and old assignments
    const recentAssignments = assignments.slice(0, 5);
    const oldAssignments = assignments.slice(5);

    res.json({
      className: classInfo.name, // ✅ Now returns the correct class name
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

// ✅ Submit an Assignment (Student)
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

// ✅ Provide Feedback on a Submission
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

// ✅ Delete a Submission
router.delete("/submissions/:id", async (req, res) => {
  try {
    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
    if (!deletedSubmission) return res.status(404).json({ error: "Submission not found" });

    res.json({ message: "✅ Submission deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete submission." });
  }
});

// ✅ Refresh All Data (For Debugging)
router.get("/refresh", async (req, res) => {
  try {
    const [classes, assignments, submissions] = await Promise.all([
      Class.find(),
      Assignment.find(),
      Submission.find(),
    ]);

    res.json({ classes, assignments, submissions });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to refresh data." });
  }
});

// ✅ Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Upload Route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

// ✅ Serve Uploaded Files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Export Router
export default router;
