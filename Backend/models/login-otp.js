const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    otp : {
        type : String,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false     
    },
    timestamp : {
        type : Date,
        default : Date.now(),
        set : (timestamp) => new Date(timestamp),
        get : (timestamp) => timestamp.getTime()
    }
})

module.exports =  mongoose.model('otp-login',otpSchema);