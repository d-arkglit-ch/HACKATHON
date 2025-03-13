const passport =  require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user =  require("../models/user");

passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
        let user = await user.findOne({
            googleId:profile.id});
            if(!user){
                user = new UserActivation({
                    googleId:profile.id,
                    email:profile.emails[0].value,
                    name:profile.displayName,
                });
                await user.save();
            }
            done(null,user);
        }catch(err){
            done(err,null);
        }
        }));
       

        passport.serializeUser(
            (user, done)=>{
            done(null, user.id);
                });
                passport.deserializeUser(async(id,  done)=>{
                    try{
                        const user =await user.findById(id);
                        done(null , user);
                    }catch(err){
                        done(err,null);
                    }
                }
                );
    
