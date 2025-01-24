// here we will create the mongoose schema
const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    maxlength:32,
  },
  lastName:{
    type:String,
    maxlength:20,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    // validator validates the email . if the email is not valid it will throw an error
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid email"+value);
      }
    }
    
  },
  password:{
    type:String,
    required:true,
    // vallidator validates the passowrd, if the password is not strong then it will throw an error
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("less secure password" + value);
      }
    }
    
  },
  age:{
    type:Number,
  },
  gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("invalid gender");
      }
    }
  },
  photoUrl:{
    type:String,
    default:"https://th.bing.com/th/id/OIP.w0TcjC4y9CxTrY3sitYa_AAAAA?rs=1&pid=ImgDetMain"
  },
  about:{
    type:String,
  },
  skills:{
    type:[String],
  }
},{
  timestamps:true,
})

User = mongoose.model('User',userSchema); 
module.exports = User;



