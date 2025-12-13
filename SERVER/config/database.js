const mongoose = require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB Connected");
    })
    .catch((e)=>{
        console.log(e);
        console.log("DB does not connected.");
        process.exit(1);
    })
};
