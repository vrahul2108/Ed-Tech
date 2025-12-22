const Tags= require('../models/Tags');

exports.createTag = async(req, res)=>{
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
            success: false,
            message: "All fields are required"
        })}

        const TagDetails = await Tag.create({
            name: name,
            description : description,
        })

        return res.status(500).json({
            success: true,
            message: "Tag Created Successfully"
        })

    }catch(e){
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}