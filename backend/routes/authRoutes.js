import express from "express";
import User from "../models/User.js";
import passport from "passport";
const router = express.Router();

// Google OAuth Sign-Up
router.get("/google/signup", (req, res, next) => {
    console.log("🔹 Google Sign-Up Triggered!");

    req.session.oauthFlow = "signup"; // Store flow in session

    passport.authenticate("google", {
        scope: ["profile", "email"],
    })(req, res, next);
});

// Google OAuth Login
router.get("/google/login", (req, res, next) => {
    console.log("🔹 Google Login Triggered!");

    req.session.oauthFlow = "login"; // Store flow in session

    passport.authenticate("google", {
        scope: ["profile", "email"],
    })(req, res, next);
});



// Set User Role After Sign-Up
router.post("/set-role", async (req, res) => {
    const { googleId, username , role } = req.body;

    // Validate role
    if (!["Teacher", "Student"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const user = await User.findOneAndUpdate(
            { googleId },
            { role, username },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role" });
    }
});

// Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    async (req, res) => {
        try {
            console.log("✅ Full Google OAuth Response:", req.user);

            if (!req.user || !req.user.email) {
                console.error("❌ Google OAuth did not return an email.");
                return res.redirect("http://localhost:5173/?error=email_not_provided");
            }

            const { googleId, name, email } = req.user;
            const flow = req.session.oauthFlow || "login";

            let user = await User.findOne({ googleId });

            if (!user) {
                if (flow === "login") {
                    console.log("❌ User not found in login flow. Redirecting to home.");
                    return res.redirect("http://localhost:5173/?error=not_registered");
                }

                // New user signup
                user = new User({
                    googleId,
                    username: name,
                    email,
                    role: null,
                });

                await user.save();
                return res.redirect(`http://localhost:5173/additional-details?googleId=${googleId}`);
            }

            if (!user.role) {
                return res.redirect(`http://localhost:5173/additional-details?googleId=${googleId}`);
            }

            // ✅ New Logic for Students
            if (user.role === "Student") {
                console.log("🔍 Checking if student has joined any classes...");
            
                const populatedUser = await User.findById(user._id).populate("classesJoined");
            
                console.log("📦 Populated User:", populatedUser);
            
                const hasJoinedClass = populatedUser.classesJoined && populatedUser.classesJoined.length > 0;
                console.log("📌 Has Joined Class?", hasJoinedClass);
            
                const studentRedirect = hasJoinedClass
                    ? "http://localhost:5173/joined-subjects"
                    : "http://localhost:5173/student-dashboard";
            
                return res.redirect(studentRedirect);
            }
            

            // For Teacher
            if (user.role === "Teacher") {
                return res.redirect("http://localhost:5173/teacher-dashboard");
            }

            // Default fallback
            res.redirect("http://localhost:5173/");
        } catch (error) {
            console.error("🚨 OAuth Error:", error);
            res.redirect("http://localhost:5173/");
        }
    }
);



const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  };

//profile rooute

  router.get("/profile"  ,isAuthenticated,(req, res)=>{
    res.json({
        username:req.user.username,
        email:req.user.email ,
        role:req.user.role,
    });
    });

// Logout
router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("❌ Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
  
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ Session destruction error:", err);
          return res.status(500).json({ error: "Session destruction failed" });
        }
  
        res.clearCookie("connect.sid"); // Remove session cookie
        res.json({ message: "✅ Successfully logged out!" });
      });
    });
  });






router.get('/google/callback', async (req, res) => {
    try {
        const user = { 
            name: req.user.displayName, 
            email: req.user.emails[0].value, 
            role: req.user.role, // Example: Assign role dynamically
        };

        req.session.user = user; // Store user in session

        res.redirect('/dashboard'); // Redirect after login
    } catch (error) {
        res.status(500).json({ error: "Google Auth Failed" });
    }
});

export default router;
