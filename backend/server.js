import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/auth.js";  // Import Google OAuth setup
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.send("Backend is running!"));

// Authentication Routes
import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
