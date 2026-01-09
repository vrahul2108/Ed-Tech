//reset Pass token
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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


//Actual password reset
//new password is fun me ayng and use hum update karenge
exports.resetPassword = async(req, res)=>{
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;

        //validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: 'Password doen]s not match'
            })
        }
        //get userdetails from db user
        const userDetails = await User.findOne({token: token})
        //No entry - invalid token
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: 'Token  is invalid'
            })
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: 'Token is expired'
            })
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);

        //pass update
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )
        //return response
        return res.status(200).json({
                success: true,
                message: 'Password resetted'
            })
    }catch(e){
        return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            })

    }
}