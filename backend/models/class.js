import mongoose from "mongoose"; 

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String },
  semester: { type: String }, 
  code: { type: String, unique: true, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }]
});

<<<<<<< HEAD
const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);
export default Class;
=======
// ✅ Prevent OverwriteModelError
export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
>>>>>>> c4b88e2157735ee558c348907e1355d35714a700
