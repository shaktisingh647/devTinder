const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user')
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    // Get the logged-in user ID
    const fromUserId = req.user._id;

    // Extract the recipient user ID and status from params
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"invaid status type"});
    }
    // Validate status
    const validStatuses = ['ignored', 'interested', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    // check if there is a connection request already exixst
     const exixstingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
        ],
     }) 
    if(exixstingConnectionRequest){
        return res.status(400).send({
            message:"connection request already exixst"
        })
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
    return res.status(404).json({
        message:"User not found"
    })
    }
    // Create and save the connection request
    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const savedRequest = await newRequest.save();

    // Respond with success
    res.status(201).json({
      message:req.user.firstName + " is " + status + " in " + toUser.firstName,
      data: savedRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to send connection request: ${error.message}` });
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth,async (req,res)=>{
// the user which i loggedIn will be attached to the request
try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    // validating the status
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"status not allowed"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
    })
    if(!connectionRequest){
        return res.status(404).json({
            message:"connection request not found"
        })
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({message:"connection request " + status,data})
}catch(error){
    res.status(400).send("error" + error.message);
}

})
module.exports = requestRouter;
