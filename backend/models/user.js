import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: { type: String, },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Teacher", "Student"],  default: null },
}, { discriminatorKey:"role", timestamps: true });

export default mongoose.model("User", UserSchema);

