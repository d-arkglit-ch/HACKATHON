import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/auth.js";  // Import Google OAuth setup
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Connect to MongoDB Atlas
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/classroomSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Models
const Class = mongoose.model("Class", new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
}));

const Assignment = mongoose.model("Assignment", new mongoose.Schema({
  classId: String,
  title: String,
  description: String,
  fileUrl: String,
  dueDate: Date,
}));

const Submission = mongoose.model("Submission", new mongoose.Schema({
  assignmentId: String,
  studentName: String,
  fileUrl: String,
  feedback: String,
  grade: String,
}));

// Routes
app.use("/auth", authRoutes);
app.options("*", cors()); // Allow preflight requests
app.get("/", (req, res) => res.send("Backend is running!"));

// Start Server



// 1. Create a Class
app.post("/api/classes", async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name, code: uuidv4() });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get All Classes
app.get("/api/classes", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete a Class
app.delete("/api/classes/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: "Class not found" });

    res.json({ message: "✅ Class deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete class." });
  }
});

// 4. Create an Assignment
app.post("/api/assignments", async (req, res) => {
  try {
    const { classId, title, description, fileUrl, dueDate } = req.body;
    const newAssignment = new Assignment({ classId, title, description, fileUrl, dueDate });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Assignments for a Class
app.get("/api/assignments/:classId", async (req, res) => {
  try {
    const assignments = await Assignment.find({ classId: req.params.classId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Delete an Assignment
app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) return res.status(404).json({ error: "Assignment not found" });

    res.json({ message: "✅ Assignment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete assignment." });
  }
});

// 7. Submit an Assignment
app.post("/api/submissions", async (req, res) => {
  try {
    const { assignmentId, studentName, fileUrl } = req.body;
    const newSubmission = new Submission({ assignmentId, studentName, fileUrl });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Get Submissions for an Assignment
app.get("/api/submissions/:assignmentId", async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Provide Feedback on a Submission
app.post("/api/submissions/:submissionId/feedback", async (req, res) => {
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

// 10. Delete a Submission
app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
    if (!deletedSubmission) return res.status(404).json({ error: "Submission not found" });

    res.json({ message: "✅ Submission deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete submission." });
  }
});

// 11. Refresh All Data
app.get("/api/refresh", async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});