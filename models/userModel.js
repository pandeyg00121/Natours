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
        minLength: 8,
        select:false
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
    },
    passwordChangedAt: Date
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    return next();

    this.password=await bcrypt.hash(this.password,12);

    this.passwordConfirm=undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        
        return JWTTimestamp < changedTimestamp;
        // JWTTimestamp-> time when token issued(100)
        // changedTimestamp -> time when password changed(200)
        //return true if pswd changed after token issued time (100<200 )->true 
    }
    //false means password Not changed
    return false;
};
const User=mongoose.model('User',userSchema);
module.exports=User;