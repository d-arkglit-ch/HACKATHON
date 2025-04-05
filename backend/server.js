import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import "./config/auth.js"; // ✅ Import Google OAuth setup
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import classRoutes from "./routes/classRoutes.js";

dotenv.config();
const app = express();

// ✅ Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/classroomSystem")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ Set frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ Explicitly list allowed methods
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
  origin: "http://localhost:5173", 
    secret: process.env.SESSION_SECRET||"your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,  // Set to `true` only if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Student route
app.use("/class", classRoutes);

// Authorization Routes
// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => res.send("🚀 Backend is running!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
