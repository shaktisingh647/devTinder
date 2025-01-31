const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to  the User model (optional, if you have it)
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (optional, if you have it)
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"], // Fixed enum syntax
      default: "interested", // Optional: Default status
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

connectionRequestSchema.pre("save", function (next){
  const connectionRequest = this;
  // check if fromUserId is same to toUserId means that user can not send request to himself
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("cannot send connection request to  yourself")
   }
   next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;
