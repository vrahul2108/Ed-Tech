const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true
    },
    courseDescription:{
        type: String,
    },
    instructor :{
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.type.ObjectId,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.type.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
    },
    thumbnail:{
        type: String,
    },
    tag: {
        type: mongoose.Schema.type.ObjectId,
        ref: "Tag"
    },
    studentEnrolled: {
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref: "User",
    }
});

module.exports = mongoose.model("Course", courseSchema); 