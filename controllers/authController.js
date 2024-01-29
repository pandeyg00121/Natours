const {promisify}=require('util')
const jwt=require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
exports.signup = catchAsync(async(req,res,next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token= signToken(newUser._id);
    res.status(201).json({
        status:'success',
        token,
        data:{
           user:newUser 
        }
    });
});

exports.login= catchAsync(async(req,res,next) => {
        const {email,password} = req.body;

    if(!email || !password){
    return next(new AppError('Please Provide email and password',400));
    }

    const user = await User.findOne({ email }).select('+password');
    // console.log(user);
    const correct = await user.correctPassword(password,user.password);

    if(!user || !correct){
        return next(new AppError('Incorrect Email or password',401));
    
    }
    const token= signToken(user._id);

    res.status(200).json({
        status:'success',
        token
    });
});

exports.protect = catchAsync(async(req ,res ,next )=>{
    let token;
    // 1) Getting token and check of it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if(!token){
        //401 stands for unauthorized
        return next(new AppError('You are not logged in ! Please log in to get acess',401))
    }
    //2)Verification of token
    const decoded =await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // console.log(decoded);

    //3) Check if User still Exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The user belonging to this token does not exist.',401)); 
    }
    //4)check if user changed password after JWT was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password!,please log in again',401));
    }
    //all 4 steps verified then we grant acess to the next chained middleware
    req.user=freshUser;
    next();
});