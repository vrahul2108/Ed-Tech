const Course = require('../models/Course');
const Category = require("../models/Category");
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');

exports.createCourse = async (req, res)=>{
    try{
        
        let {courseName, courseDescription, whatYouWillLearn, price, tag, category,status,instructions} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
        ){
            return res.status(400).json({
            success: false,
            message: 'All Fields Are Required!'
        })
        }

        if (!status || status === undefined) {
			status = "Draft";
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

        const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail, process.env.FOLDER_NAME);

        //creating entry for new course

        const newCourse = await Course.create({
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
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

        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

        res.status(200).json({
            success: true,
            message: "New course Created",
            data: newCourse
        })

    }catch(error){
        console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
        })
    }
}


//Get all courses
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        // .populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
