const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    sectionName:{
        type: String,
    },
    subSection: [{
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref :"SubSection"
    }]
});

module.exports = mongoose.model("Section", subSectionSchema); 