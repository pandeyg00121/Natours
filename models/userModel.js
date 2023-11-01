const mongoose=require('mongoose');
const validator=require('validator');

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required: [true,'A User must have a name']
    },
    email:{
        type: String,
        required: [true,'A User must have a Email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'please provide a valid Email']
    },
    photo :String,
    password:{
        type:String,
        required: [true,'A User must have a password'],
        minLength: 8
    },
    passwordConfirm:{
        type: String,
        required: [true,'Please Confirm Your Password']
    }
});

const User=mongoose.model('User',userSchema);
module.exports=User;