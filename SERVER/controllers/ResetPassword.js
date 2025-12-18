//reset Pass token
const User = require("../models/User");
const mailSender = require("../utils/mailSender");



//reset pass
exports.resetPasswordToken = async(req, res)=>{
    try{
        //extract email
    const email = req.body.email;

    //check user for this email, email verification
    const user = await User.findOne({email: email});

    if(!user){
        return re.json({
            success: false,
            message: "Your email is not registered with us"
        });
    }

    //gen token

    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
        {email: email},
        {
            token : token,
            resetPasswordExpires: Date.now()+ 5*60*1000,
        },
        {new: true}
    );

    //create url

    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing url

    await mailSender(email, "Password Reset Link",`Password reset link: ${url}`);

    //return response
    return res.json({
        success: true,
        message: 'Reset password successfully'
    });
    }
    catch(e){
        return res.status(500).json({
        success: false,
        message: 'Something went wrong while reset password'
    });
    }
}
