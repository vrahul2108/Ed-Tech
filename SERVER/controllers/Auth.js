const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator') 
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
require('dotenv').config(); 

//sendotp
exports.sendOTP = async(req, res)=>{

    try{
        //fetch email
        const {email} = req.body;

        //check user exist
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message:'user already registered'
            })
        }

        //gen otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets: false,
            specialChars:false
        })
        console.log('OTP generatod: ', otp);
        
        //check unique otp or not

        const result = await OTP.findOne({otp: otp});
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
               lowerCaseAlphabets: false,
               specialChars:false
            })
            result = await OTP.findOne({otp: otp});
        }

        const payload = {email, otp};
         
        //create an entry for otp

        const otpBody = await OTP.create(payload);
        console.log(otpBody);
        
        //return response
        res.status(200).json({
            success:true,
            message: 'OTP sent successfully',
            otp,
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
                success: false,
                message:'Internal Server Error'
            })
    }
}


//signUp
exports.signUp = async(req, res)=>{
    try{
        //data extract from req
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }

        //Dono password validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: 'Password and confirmPassword value does not match, please try again later.'
            });
        }

        ///User already exist/ not
        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                success: false,
                message: 'User is already registered'
            })
        }

        //find most recent otp stord from user
        const recentOtp = await OTP.findOne({email}).sort({createdAt : -1}).limit(1);
        console.log(recentOtp);
        
        //otp validation
        if(recentOtp.length == 0){
            return res.status(401).json({
                success: false,
                message: 'OTP Not found',
            })
        }else if(otp !== recentOtp.otp){
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP'
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Entry creation in DB
        const profileDetails = await Profiler.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        }) 


        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        //retrun res
        return res.status(200).json({
            success: true,
            message: 'User is registered successfully',
            user
        });
        
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'User can not registered Please try again !!!',
            user
        })
    }
}


//LoginUp
exports.login = async (req, res)=>{
    try{
        //extract data
        const {email, password} = req.body;

        //validate data
        if(!email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        //user exist or not
        const user = await User.findOne({email}).populate('additionalDetails');
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User does not exist please sign up"
            })
        }


    //generate jwt
    

    if(await bcrypt.compare(password, user.password)){
    const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : "2h"
    });
    user.token = token;
    user.password = undefined;

    //cookie creation and response sending

    const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000), 
        httpOnly: true,
    }
    res.cookie("token", token, options).status(200).json({
        success: true,
        token, 
        user,
        message:"Logged In Successfully"
    })
    }
    else{
        return res.status(401).json({
                success: false,
                message: "Password not matched"
            })
    }
    }catch(e){
        console.log(e);
        return res.status(500).json({
                success: false,
                message: "Server Error"
            })
    }
}


//changePassword HW

exports.changePwd = async(req, res)=>{
    //extract data
    try{
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const email = req.user.email;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    //send Mail
    await mailSender(
      user.email,
      "Password Changed Successfully",
      `
        <h2>Hello ${user.firstName},</h2>
        <p>Your password has been changed successfully.</p>
        <p>If this was not you, please reset your password immediately.</p>
        <br/>
        <p>Regards,<br/>Auth System Team</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Email sent.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
    //return res
}  