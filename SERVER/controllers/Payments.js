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

    //order create
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
exports.verifySignature = async(req, res)=>{
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];
    
    crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log('Payment is Authorized');

        const {userId, courseId} = req.body.payload.payment.notes;

        try{
            //fulfill the action

            //find the course and enroll the student in it.
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id: courseId},
                {$push:{studentEnrolled:userId}},
                {new: true},
            );

            if(!enrolledCourse){
                return res.json({
                    success: false,
                    message: 'could not find the course',
                });
            }

            //find the student and add course in list of enrolled courses

            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {
                    $push:{courses:courseId}
                },
                {new:true},
            );

            console.log(enrolledStudent);

            //mail send kro confirmation ka
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulatons from StudyNotion",
                "Congratulations! You are onboarded on the new course"
            );

            console.log(emailResponse);
            
            return res.status(200).json({
                success: true,
                message: 'Signature Verified and course added',
            });
            
        }catch(e){
            console.log(e);
            return res.status(500).json({
                success: false,
                message: e.message,
            });
        }
    }
    else{
        return res.status(400).json({
              success: false,
              message: 'Internal Server Error',
        });
    }
};