import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },         // ✅ department added & required
  subject: { type: String, required: true },            // ✅ subject made required
  semester: { type: String },
  code: { type: String, unique: true, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }]
}, { timestamps: true });

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);
export default Class;
