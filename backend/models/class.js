import mongoose from "mongoose"; 

const ClassSchema = new mongoose.Schema({
  name: {type: String, required: true},
  subject: { type: String },
  semester: { type: String }, 
  code: { type: String, unique: true, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }]
});

export default mongoose.model("Class", ClassSchema);
