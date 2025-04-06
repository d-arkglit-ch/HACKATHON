import mongoose from "mongoose"; 

const SubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student who submitted
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true }, // Links to assignment
  content: { type: String }, // Can be text-based submission
  fileURL: { type: String }, // URL for file submission (if any)
  submissionDate: { type: Date, default: Date.now }, // Auto-filled when submitting
  feedbacks: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher reference
      feedbackText: { type: String, required: true },
      score: { type: Number, min: 0, max: 100 }
    }
  ]
}, { timestamps: true });

<<<<<<< HEAD
const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
export default Submission;
=======
// ✅ Prevent model overwrite
export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
>>>>>>> c4b88e2157735ee558c348907e1355d35714a700

