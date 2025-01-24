const express = require('express');
const app = express();
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {validateSignupData} = require('./utils/validation');
const {userAuth} = require('./middlewares/auth')
// now creating tshe signup api
const User = require("./models/user");
app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req,res)=>{
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
      res.status(400).send(error.message);
    }
  })
// now creating the login api
app.post("/login", async (req,res)=>{
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
                const token = await jwt.sign({_id:user._id},"shaktisinghsecretkey");

                res.cookie("token",token); 
                res.send("login succesfully");
                
            }else{
                res.status(400).send("invalid passowrd");
            }
        
    }catch(error){
        res.status(400).send("error while fetching all the users");
     }
})

// creating a get api to get the profile details of the user
app.get("/profile", userAuth, (req,res)=>{
    try{
    const user = req.user;
    res.send(user);
    console.log(user);
    }catch(error){
        res.status(500).send("error while fetching the user");
    }
})

// creatig an api to send the connection request
app.post("/sendConnectionRequest", userAuth, async (req,res)=>{
    console.log("sending connection request");
    res.send("connection request sent successfully");
})

 

connectDB().then(()=>{
    console.log('Database connected succesfully');
    app.listen(3000,(req,res)=>{
        console.log("server is listening on port 3000");
    })
}).catch((error)=>{
    console.log('Error while connecting to the database',error);
})















