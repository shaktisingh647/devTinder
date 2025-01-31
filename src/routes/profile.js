const express = require('express');
const User = require("../models/user");
const profileRouter = express.Router();
const bcrypt = require('bcrypt')
const {validateEditProfileData} = require("../utils/validation")
const {userAuth} = require('../middlewares/auth')
profileRouter.get("/");


profileRouter.get("/profile/view", userAuth, (req,res)=>{
    try{
       
    const user = req.user;
    res.send(user);
    
    }catch(error){
        res.status(500).send("error while fetching the user");
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
   try {
       if (!validateEditProfileData(req)) {
           return res.status(400).json({ success: false, message: "Invalid edit request" });
       }

       const loggedIn = req.user;
       Object.keys(req.body).forEach((key) => (loggedIn[key] = req.body[key]));

       await loggedIn.save(); 

       res.json({ 
           success: true,
           message: "Profile updated successfully",
           data: loggedIn  
       });
   } catch (error) {
       console.error("Profile update error:", error);
       res.status(500).json({ success: false, message: "Failed to update profile" });
   }
});

//  now creating reset password
profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
 const {oldPassword,newPassword} = req.body;
 const user = req.user;
 if(!user || !oldPassword || !newPassword){
    return res.send("invalid request");
 }
const isMatch = await bcrypt.compare(oldPassword,user.password);
 if(!isMatch){
    return res.send("old password is incorrect");
 }
const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await user.save();
res.send("Password updated successfully");
})
module.exports = profileRouter;