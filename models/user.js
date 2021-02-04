const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : true,
        unique : true
    },

    email :{
    type  : String,
    required : true,
    unique : true
    },

    sexe :{
        type  : String,
        required : true
    },

    birthday :{
        type : Date,
        // required : true
    },

    postalCode :{
        type : Number,
        required : true
    },

    points :{
        type : Number,
        default : 0
    },

    email :{
        type  : String
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