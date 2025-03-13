// The User.js file defines how user data is structured and stored in MongoDB using Mongoose, a popular ODM (Object Data Modeling) library for Node.js.

// This model is used in our authentication system to store user details after they log in via Google OAuth.



//import mongoose
const  mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
    googleID:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    name:{
        type:String,
        required:true
    },

    role: {
        type:String,
        enum:["Teacher" ,"Student"],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});



const user = mongoose.model("User" , userSchema);
module.exports=User;