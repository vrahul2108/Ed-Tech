const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');

exports.createCourse = async (req, res)=>{
    try{
        //data fetch
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !thumbnail || !price || !tag){
            return res.status(400).json({
            success: false,
            message: 'All Fields Are Required!'
        })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        //todo to check why we need to do here db call for ins id
    
        console.log("Instructor Details :", instructorDetails);
        
        if(!instructorDetails){
            return res.status(401).json({
             success: false,
             message: 'Instructor Details are not exist'
        })
        }

        //check for tag details

        const tagDetails = await Tag.findById(tag);

        if(!tagDetails){
            return res.status(401).json({
             success: false,
             message: 'Tag Details not found'
        })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //creating entry for new course

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            tag: tagDetails._id,
            price,
            thumbnail: thumbnailImage.secure_url,
        })

        //Add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
           {new: true})

        //update the tag schema
         await Tag.findByIdAndUpdate(
            {_id: tagDetails._id},
            {course : newCourse._id},
            {new: true}
         )
         return res.status(200).json({
            success: true,
            message: "New course Created",
            data: newCourse
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


//Get all courses
exports.getAllCourse = async(req, res)=>{
    try{

        const allCourses = await find({});
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
          
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: e.message
        })
    }
}
