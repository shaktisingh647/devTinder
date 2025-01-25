// authentication of theconst adminAuth = (req,res)=>{
    const jwt = require('jsonwebtoken');
    const User = require('../models/user');
    const cookieParser = require("cookie-parser");
    const userAuth = async (req,res,next)=>{
    // read the token from the cookies
    // since the cookies is present under the token
    try{
        const {token} = req.cookies;
    if(!token){
        throw new Error("User Not Authenticated");
    }
    console.log(token);
    const decodedData = await jwt.verify(token,"shaktisinghsecretkey");
    const {_id} = decodedData;
    const user = await User.findById(_id);
    if(!user){
        return res.status(400).send("User Not Found");
    }
    req.user = user;
    next();
    }catch(error){
        res.status(400).send("Error"+error.message);
    }
    // now we have to verify the token {validate } the token

    };


module.exports = {
    userAuth,
};

