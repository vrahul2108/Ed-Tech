const User = require('../models/User');
const Profile = require('../models/Profile');

exports.updateProfile = async(req, res)=>{
    try{

        const {dateOfBirth = "", about="", contactNumber,gender } = req.body;

        const id = req.user.id;

        if(!contactNumber || !gender || !id){
           return res.status(400).json({
            success: false,
            message: 'ALl Fields are required'
        }) 
        }

        //finding the profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profileDetails,
        });

    }catch(e){
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.deleteProfile = async(req, res)=>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails){
         return res.status(400).json({
            success: false,
            message: 'user not found'
        })}

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        //to unenroll from the course of this user
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.getAllUserDetails = async(req, res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success: true,
            message: 'Data Fetched Successfully'
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}