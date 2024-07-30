const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,"Enter Name"]
    },
    email : {
        type : String,
        required : [true,"Enter email"]
    },
    password : {
        type : String,
        required : true,
        minlength : [8,"minimum length should be 8"]
    },
    age : {
        type : Number,
        min : [8,"minimum age should be 8"]
    },
    mobile : {
        type : String,
        required : [true,"Enter mobile number"],
        minlength : [10,"Enter complete number"],
        maxlength : [10,"Enter correct number"]
    }
},{timestamps : true})

const  userModel = mongoose.model('users',userSchema);

module.exports = userModel;