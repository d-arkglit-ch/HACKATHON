import express from "express";
import User from "../models/User.js";
import Class from "../models/class.js";
import Assignment from "../models/assignments.js";
import Submission from "../models/submission.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Joining the class through code
router.post("/join-class", async (req, res) => {
    console.log("Request received:", req.body);
    try {
        const { studentEmail, classCode } = req.body;

        // Find class and populate students to get their details
        const classData = await Class.findOne({ code: classCode })
        .populate({
            path: "students",
            model: "User", // This will return populated students (users)
            select: "email role" // We are only interested in the email and role fields
        });

        if (!classData) {
            return res.status(404).json({ message: "Invalid class code" });
        }

        // Check if student is already in the class
        const isAlreadyJoined = classData.students.some(student => student.email === studentEmail);
        if(isAlreadyJoined){
            return res.status(400).json({ message: "Already joined this class"});
        }
        // Add student to the class
        const student = await User.findOne({ email: studentEmail, role: "Student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        classData.students.push(student._id);
        await classData.save();

        // Update student collection
        await User.findByIdAndUpdate(student._id, { 
            $push: { classesJoined: classData._id }
        });

        res.status(200).json({ message: "Class joined successfully", classId: classData._id  });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
});
export default router;