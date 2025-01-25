const express = require('express');

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {validateSignupData} = require('../utils/validation');
authRouter.get("/")

const jwt = require('jsonwebtoken');
// creating the signup api
authRouter.post("/signup", async (req,res)=>{
    try { 
      
      validateSignupData(req);
      const {firstName,lastName,email,password} = req.body;
      const hashPassword = await bcrypt.hash(password,10);
      const user = new User({
        firstName,
        lastName,
        email,
        password:hashPassword,
      });
      
      await user.save();
      res.send("user saved successfully");
    } catch (error) {
      console.error(error); // Log the actual error
      res.status(500).send(`Error during login: ${error.message}`);
    }
  })

// login api
authRouter.post("/login", async (req,res)=>{
  try{
    
      const {email,password} = req.body;
      const user = await User.findOne({email:email});
      if(!user){
          res.status(400).send("user not found");
      }
      const isPasswordValid = await bcrypt.compare(password,user.password);
          if(isPasswordValid){
              // creating jwt token
              // we have to create the token at the password level when the user is authenticated then only we will give the token
              const token =  jwt.sign({_id:user._id},"shaktisinghsecretkey");
              // entering the token into the cookie
              
              res.cookie("token",token); 
              res.send("login succesfully");
              
          }else{
              res.status(400).send("invalid passowrd");
          }
      
  }catch(error){
    console.error(error); // Log the actual error
  res.status(500).send(`Error during login: ${error.message}`);
  }
})




module.exports = authRouter;