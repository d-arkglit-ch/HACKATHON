import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileURL: { type: String }, // 🔹 Teacher uploads file (PDF, Doc, etc.)
    dueDate: { type: Date },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, // Links to a specific class
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // Creator of assignment
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }] // Stores all submissions from students
  },
  { timestamps: true }
);
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;

