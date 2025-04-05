import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback", // Updated port to 5001
      scope: ["profile", "email"],
      prompt: "consent", // ✅ Ensures email is returned
      state: true, 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Full Google Profile:", profile);

        // ✅ Ensure email exists, else return error
        const userEmail = profile.emails?.[0]?.value || null;
        if (!userEmail) {
          console.error("❌ Google OAuth did not return an email. Ensure 'email' scope is enabled.");
          return done(new Error("Google OAuth did not return an email"), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: userEmail,
            role: null, // Role will be added after signup
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        console.error("🚨 Google OAuth Strategy Error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
