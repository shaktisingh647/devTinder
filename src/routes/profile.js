const express = require('express');
const User = require("../models/user");
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
profileRouter.get("/");


profileRouter.get("/profile", userAuth, (req,res)=>{
    try{
       
    const user = req.user;
    res.send(user);
    
    }catch(error){
        res.status(500).send("error while fetching the user");
    }
})

module.exports = profileRouter;