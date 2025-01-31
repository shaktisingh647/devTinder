const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const Users = require('../models/user')
// fetches all the connections received to the user 
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
 try{
  const loggedInUser = req.user;
  const connectionRequest = await ConnectionRequest.find({
    // the person who got these request must be loggedInUser
    // means toUserId must be loggedIn
    toUserId:loggedInUser._id,
    status:"interested",
  }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","gender","skills"]);
  res.json({message:"Data fetched successfully",data:connectionRequest});
 }catch(err){
    return res.status(400).send("error"+err.message);
 }
})  

// now creating the connections api , matched user 
userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
    
   const loggedInUser = req.user;
   const connectionRequest = await ConnectionRequest.find({
    $or:[
      {toUserId:loggedInUser._id,status:"accepted"},
      {fromUserId:loggedInUser._id,status:"accepted"},
    ]
   }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","gender","skills"]).populate("toUserId",["firstName","lastName","photoUrl","age","about","gender","skills"]);
   const data = connectionRequest.map((row)=>{
    if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
      return row.toUserId
    }
      return row.fromUserId})
   res.json({data});
  }catch(err){
    return res.status(400).send("Error" + err.message);
  }
})


// filepath: /C:/Users/PRIYA SINGH/OneDrive/Desktop/DevTinder/src/routes/user.js
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("Logged in user:", loggedInUser); // Log the logged-in user

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all connection requests sent or received by the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    console.log("Connection requests:", connectionRequests); // Log the connection requests

    // Add users involved in connection requests to the exclusion set
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Find users not in the exclusion set and not the logged-in user
    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(["firstName", "lastName", "photoUrl", "age", "about", "gender", "skills"]).skip(skip).limit(limit);

    console.log("Users:", users); // Log the users

    // Send the filtered users as the response
    res.json({ users, connectionRequests });
  } catch (err) {
    console.error("Error fetching feed:", err.message); // Log the error
    res.status(400).json({ error: err.message });
  }
});
 
module.exports = userRouter;
