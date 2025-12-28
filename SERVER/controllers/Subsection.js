const Subsection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/ImageUploader');

exports.createSubsection = async(req, res)=>{
    try{
        //data fetch
        //fetch video/file
        //validation
        //upload video to cloudinary for video url 
        //create subsection
        //update section with this sub section object id
        //retrun response

        const {sectionId, title, timeDuration, description} = req.body;

        const video = req.files.videoFile;

        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                    subSection: SubSectionDetails._id,
                }
            },
            {new: true}
        ).populate({
        path: "subSection",
        });    

        return res.status(200).json({
            success: true,
            message: 'Subsection Created Successfully'
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};

exports.updatedSubsection = async (req, res)=>{
    try{

    }catch(e){

    }
}

exports.deleteSubsection = async (req, res)=>{
    try{

    }catch(e){
        
    }
}