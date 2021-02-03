const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : true
    },

    lastName :{
        type  : String,
        required : true
    },

    email :{
    type  : String,
    required : true,
    unique : true
    },

    password :{
        type  : String,
        required : true
    },

    date :{
        type : Date,
        default : Date.now
    },

    admin :{
        type : Boolean,
        default : false
    },

    resetPasswordToken :{
        type : String
    },

    resetPasswordExpires :{
        type : Date
    }
});

module.exports = mongoose.model('User',UserSchema);