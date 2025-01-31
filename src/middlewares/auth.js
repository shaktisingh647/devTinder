// authentication of theconst adminAuth = (req,res)=>{
    const jwt = require('jsonwebtoken');
    const User = require('../models/user');
    
    const userAuth = async (req,res,next)=>{
    // read the token from the cookies
    // since the cookies is present under the token
    try{
        const {token} = req.cookies;
    if(!token){
        throw new Error("User Not Authenticated");
    }
    
    const decodedData = await jwt.verify(token ,process.env.JWT_SECRET);
    const {_id} = decodedData;
    const user = await User.findById(_id)
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

