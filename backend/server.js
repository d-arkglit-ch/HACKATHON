import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/auth.js";  // Import Google OAuth setup
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js"

dotenv.config();
const app = express();

// Connect to MongoDB Atlas
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/classroomSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
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

// Student route
app.use("/class", classRoutes);

// Authorization Routes
app.use("/auth", authRoutes);
app.options("*", cors()); // Allow preflight requests
app.get("/", (req, res) => res.send("Backend is running!"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`🚀 Server running on http://localhost:${PORT}`);
});

