const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    course :{
        type: mongoose.Schema.type.ObjectId,
        ref: "Course"
    },
});

module.exports = mongoose.model("Tag", tagSchema);