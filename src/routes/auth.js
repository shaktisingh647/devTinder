const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const {validateSignupData} = require('../utils/validation');
authRouter.get("/")

const jwt = require('jsonwebtoken');
// creating the signup api
// authRouter.post("/signup", async (req,res)=>{
//     try { 
      
//       validateSignupData(req);
//       const {firstName,lastName,email,password} = req.body;
//       const hashPassword = await bcrypt.hash(password,10);
//       const user = new User({
//         firstName,
//         lastName,
//         email,
//         password:hashPassword,
//       });
      
//       const savedUser = await user.save();
//       const token = await savedUser.getJWT();
//       res.cookie("token", token,{
//         expires: new Date(Date.now() + 8 * 3600000)
//       }

//       )
//       res.json({message:"user saved successfully",data:savedUser});
//     } catch (error) {
//       console.error(error); // Log the actual error
//       res.status(500).send(`Error during login: ${error.message}`);
//     }
//   })
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
    
    const savedUser = await user.save();
    // Generate token directly instead of using getJWT
    const token = jwt.sign(
      { _id: savedUser._id },
      process.env.JWT_SECRET || "",
      { expiresIn: '8h' }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    });
    res.json({message:"user saved successfully",data:savedUser});
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error during login: ${error.message}`);
  }
});

// login api
authRouter.post("/login", async (req,res)=>{
  try{
    
      const {email,password} = req.body;
      const user = await User.findOne({email:email});
      if(!user){
          return res.status(400).send("user not found");
      }
      const isPasswordValid = await bcrypt.compare(password,user.password);
          if(isPasswordValid){
              // creating jwt token
              // we have to create the token at the password level when the user is authenticated then only we will give the token
              // const token =  jwt.sign({_id:user._id},"shaktisinghsecretkey");
              const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET || "",  
                { expiresIn: '8h' }
              );
              
              
              // entering the token into the cookie
              
              
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,  // Use `true` in production (HTTPS)
                sameSite: "None", // Must be "None" when credentials are sent
              });
               
              res.send(user);
              
          }else{
              res.status(400).send("invalid passowrd");
          }
      
  }catch(error){
    console.error(error); // Log the actual error
  res.status(500).send(`Error during login: ${error.message}`);
  }
})

// now creating the logout api
authRouter.post("/logout",(req,res)=>{
  res.cookie("token",null,{
  expires:new Date(Date.now()),
  })
  res.send("Logout Succesfull");
})


module.exports = authRouter;