import express from "express";
import multer from "multer";

import User from "../models/User.js";
import Class from "../models/class.js";
import Assignment from "../models/assignments.js";
import Submission from "../models/submission.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Joining the class through code
router.post("/join-class", async (req, res) => {
  console.log("Request received:", req.body);
  try {
    const { studentEmail, classCode } = req.body;

    // Find class and populate students to get their details
    const classData = await Class.findOne({ code: classCode }).populate({
      path: "students",
      model: "User", // This will return populated students (users)
      select: "email role", // We are only interested in the email and role fields
    });

    if (!classData) {
      return res.status(404).json({ message: "Invalid class code" });
    }

    // Check if student is already in the class
    const isAlreadyJoined = classData.students.some(
      (student) => student.email === studentEmail
    );
    if (isAlreadyJoined) {
      return res.status(400).json({ message: "Already joined this class" });
    }
    // Add student to the class
    const student = await User.findOne({
      email: studentEmail,
      role: "Student",
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    classData.students.push(student._id);
    await classData.save();

    // Update student collection
    await User.findByIdAndUpdate(student._id, {
      $push: { classesJoined: classData._id },
    });

    res
      .status(200)
      .json({ message: "Class joined successfully", classId: classData._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch all classes a student has joined
router.get("/joined-classes/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await User.findOne({ email, role: "Student" }).populate(
      "classesJoined"
    );
    //     const student = await User.findOne({ email, role: "Student" })
    //     .populate({
    //     path: "classesJoined",
    //     populate: { path: "teacherId", select: "name email" }, // populate teacherId with name and email
    //   });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.classesJoined);
  } catch (error) {
    console.log("Error fetching joined classes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET /assignments/:classId
router.get("/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    // Find the class and populate its assignments
    const foundClass = await Class.findById(classId).populate("assignments");

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      className: foundClass.name,
      subject: foundClass.subject,
      assignments: foundClass.assignments,
    });
  } catch (err) {
    console.error("Error fetching assignments for class:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/submit-assignment", upload.single("pdf"), async (req, res) => {
  try {
    const { studentEmail, assignmentId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const student = await User.findOne({ email: studentEmail, role: "Student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const submission = new Submission({
      studentId: student._id,
      assignmentId,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname
      }
    });
    await submission.save();
    res.status(201).json({ message: "Assignment submitted successfully.", submission });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ message: "Failed to submit assignment.", error: err.message });
  }
});

// GET: Download file
router.get("/download/:submissionId", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);

    if (!submission || !submission.file || !submission.file.data) {
      return res.status(404).send("File not found.");
    }

    res.set({
      "Content-Type": submission.file.contentType,
      "Content-Disposition": `attachment; filename="${submission.file.fileName}"`,
    });

    res.send(submission.file.data);
  } catch (err) {
    res.status(500).json({ message: "Error downloading file" });
  }
});

export default router;
