import mongoose from "mongoose"; 

const SubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student who submitted
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true }, // Links to assignment
  content: { type: String }, // Can be text-based submission
  file: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  submissionDate: { type: Date, default: Date.now }, // Auto-filled when submitting
  feedbacks: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher reference
      feedbackText: { type: String, required: true },
      score: { type: Number, min: 0, max: 100 }
    }
  ],
    aiReview: {
    summary: String,            // Gemini-generated feedback
    marks: Number,              // Auto-evaluated score
    rawExtractedText: String    // Extracted OCR text from Azure Vision
  },
  verifiedReview: {
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  finalFeedback: String,
  finalMarks: Number,
  verifiedAt: { type: Date }
}
}, { timestamps: true }); 

const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
export default Submission;


