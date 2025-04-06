// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Configs
import "./config/auth.js"; // Google OAuth setup
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // 👈 Upload route

dotenv.config();
const app = express();

// ✅ Resolve __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/classroomSystem")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // HTTPS only if true
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ✅ Passport (for Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// ✅ Static Uploads: PDFs, etc.
const uploadsPath = path.join(__dirname, "uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
    },
  })
);

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/class", classRoutes);
app.use("/upload", uploadRoutes); // 👈 File upload route

// ✅ Health check
app.get("/", (req, res) => res.send("🚀 Backend is running!"));

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
