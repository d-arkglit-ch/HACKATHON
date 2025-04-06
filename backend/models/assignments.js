import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  title: String,
  description: String,
  fileUrl: String,
  dueDate: Date,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
