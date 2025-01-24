// creating validation for the signup api
const validateSignupData = (req) =>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are mandatory");
    }
}

module.exports = {
 validateSignupData,
}