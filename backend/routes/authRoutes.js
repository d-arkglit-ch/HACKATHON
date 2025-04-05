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
            console.log(`✅ Extracted Email: ${email}`);

            // Get stored flow from session
            const flow = req.session.oauthFlow || "login";
            console.log("✅ Google OAuth Callback Triggered! Flow Type:", flow);

            let user = await User.findOne({ googleId });

            if (!user) {
                if (flow === "login") {
                    console.log("❌ User not found in login flow. Redirecting to home.");
                    return res.redirect("http://localhost:5173/?error=not_registered");
                }

                // Create a new user without role for sign-up flow
                user = new User({
                    googleId,
                    username: name,
                    email,
                    role: null,
                });

                await user.save();
                console.log("🆕 New user created, redirecting to additional details page.");
                return res.redirect(`http://localhost:5173/additional-details?googleId=${googleId}`);
            }

            if (!user.role) {
                console.log("🔄 Existing user without role, redirecting to additional details page.");
                return res.redirect(`http://localhost:5173/additional-details?googleId=${googleId}`);
            }

            const dashboard =
                user.role === "Teacher"
                    ? "http://localhost:5173/teacher-dashboard"
                    : "http://localhost:5173/student-dashboard";

            res.redirect(dashboard);
        } catch (error) {
            console.error("🚨 OAuth Error:", error);
            res.redirect("http://localhost:5173/");
        }
    }
);

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

// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });

        req.session.destroy(() => {
            res.redirect("http://localhost:5173/");
        });
    });
});

export default router;
