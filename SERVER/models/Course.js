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
        type: [String],
        required: true,
    },
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
    studentEnrolled: {
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref: "User",
    },
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
});

module.exports = mongoose.model("Course", courseSchema); 