import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    classesJoined: [{type: mongoose.Schema.Types.ObjectId, ref: "Class"}],
    assignments: [{
        title: String,
        description: String,
        dueDate: Date,
        submitted: {type: Boolean, default: false},
    }],
});

export const Student = User.discrimnator("Student", studentSchema);