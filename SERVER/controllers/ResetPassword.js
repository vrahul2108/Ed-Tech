//reset Pass token
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};


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