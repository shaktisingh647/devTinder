// creating validation for the signup api
const validateSignupData = (req) =>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are mandatory");
    }
}


const validateEditProfileData = async (req) =>{
 const allowedEditFields = ["firstName","lastName","photoUrl","about","skills"];
 const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
 return isEditAllowed;
}
module.exports = {
 validateSignupData,
 validateEditProfileData
}