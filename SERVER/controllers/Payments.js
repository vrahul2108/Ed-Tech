const {instance} = require('../config/razorpay');
const User = require('../models/User');
const Course = require('../models/Course');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');

//capture the payment and initiate the razorpay order
exports.capturePayment = async(req, res)=>{

    //get course and user ids
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseId
    if(!course_id){
        return res.json({
            success: false,
            message: 'Please provide valid course Id',
        })
    };

    //valid courseDetail
    let course
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
              success: false,
              message: 'could noe find the course',
        });
        }

        //user already pay for the course

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(400).json({
              success: false,
              message: 'Student is already enrolled',
        });
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({
              success: false,
              message: e.message,
        });
    }

    //object create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId
        }
    };

    try{
        //initiate payment via razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.json({
              success: true,
              courseName: course.courseName,
              courseDescription: course.courseDescription,
              thumbnail: course.thumbnail,
              orderId: paymentResponse.id,
              currency: paymentResponse.currency,
              amount: paymentResponse.amount,
               });
        
    }catch(e){
        console.log(e);
        res.json({
              success: false,
              message: 'could not initiate order',
        });
    }
}

//verifying signature of Razorpay and Server