import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Teacher", "Student"], default: null },

  // Store only relevant fields
  classesJoined: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], 
    default: undefined // Only stored for students
  },
  classCreated: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], 
    default: undefined // Only stored for teachers
  }
<<<<<<< HEAD
},
{ timestamps: true 
}
);

=======
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
>>>>>>> c4b88e2157735ee558c348907e1355d35714a700
export default mongoose.models.User || mongoose.model("User", UserSchema);
