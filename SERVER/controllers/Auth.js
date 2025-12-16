const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator') 


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


        //validation


        //Dono password validation

        ///User already exist/ not


        //find most recent otp stord from user
        //otp validation

        //hash password

        
        //Entry creation in DB

        //retrun res

        
    }catch(e){

    }
}


//LoginUp