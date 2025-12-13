const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.type.ObjectId,
        ref:"Course"
    },
    
});

module.exports = mongoose.model("courseProgress", courseProgress); 