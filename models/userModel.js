const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

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
        required: [true,'Please Confirm Your Password'],
        validate:{
            //this only works on CREATE & SAVE !!!
            validator: function(el){
                return el === this.password;
            },
            message: 'Password And Confirm Password Do not match'
        }
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    return next();

    this.password=await bcrypt.hash(this.password,12);

    this.passwordConfirm=undefined;
    next();
});
const User=mongoose.model('User',userSchema);
module.exports=User;