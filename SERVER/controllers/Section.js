const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async(req, res)=>{
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: NewSection._id,
                }
            },
            {new: true},
        )
        .populate({
        path: "courseContent",
        populate: {
            path: "subSection",
        },
        });
        return res.status(200).json({
                success: true,
                message: 'Section created successsfully',
                updatedCourse,
            });
    }catch(e){
        console.log(e);
        return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
    }
};

exports.updateCourse = async(req, res)=>{
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'Unable to fetch Data',
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        )

        return res.status(200).json({
                success: true,
                message: 'Section updated successfully',
            });
        
    }catch(e){
        console.log(e);
        return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
    }
};

exports.deleteSection = async (req, res)=>{
    try{
        const {sectionId} = req.params;

        await Section.findByIdAndDelete({sectionId});
        
        //Dpo we need to delete the entry from the course schema
        return res.status(200).json({
                success: true,
                message: 'Section deleted successfully',
            });

    }catch(e){
        console.log(e);
        return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
    }
}