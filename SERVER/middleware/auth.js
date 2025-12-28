const jwt = require('jsonwebtoken');
const user = require('../models/User');
require('dotenv').config();

//auth
exports.auth = async(req, res, next) =>{
    try{
        //extract token
        const token = req.body.token
                      || req.cookies.token
                      || req.header("Authorisation").replace("Bearer ","");

        //If token missing
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }              

        //verify the token 

        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

            // jwt.verify() → checking if ID is real & not expired
            //decode → details written on the ID
            //req.user → attaching the ID to the request
            
        }catch(e){
            //verification issue
           return res.status(401).json({
            success: false,
            message: "Token is Invalid"
            }); 
        }
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//isStudent
exports.isStudent = async(req, res, next)=>{
    try{
        if(req.user.accountType !== "isStudent"){
        return res.status(401).json({
            success: false,
            message: "Protected route for student"
        });
        }
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//isInstructor
exports.isInstructor = async(req, res, next)=>{
    try{
        if(req.user.accountType !== "isInstructor"){
        return res.status(401).json({
            success: false,
            message: "Protected route for Instructor"
        });
        }
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//isAdmin
exports.isAdmin = async(req, res, next)=>{
    try{
        if(req.user.accountType !== "isAdmin"){
        return res.status(401).json({
            success: false,
            message: "Protected route for Instructor"
        });
        }
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}