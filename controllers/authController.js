const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const { log } = require("console");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  // console.log(user);
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);
  if (!token) {
    //401 stands for unauthorized
    return next(
      new AppError("You are not logged in ! Please log in to get acess", 401)
    );
  }
  //2)Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3) Check if User still Exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }
  //4)check if user changed password after JWT was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password!,please log in again", 401)
    );
  }
  //all 4 steps verified then we grant acess to the next chained middleware
  req.user = freshUser;
  next();
});

//we cannot pass argument to a middleware function so we make middleware
//inside a wrapper function so that it gets acess to parameters
//roles is an array ['admin','lead-guide']

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.freshUser.role)) {
      return next(
        new AppError("You Do not have permission to perform this task", 403)
      );
    }
  };
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user on POSTed Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }

  // 2) Generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new password and 
  passwordConfirm to:${resetURL}.\n If not prompted ignore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      mesaage: "Token sent to email !!",
    });
  } catch (err) {
    // user.passwordResetToken = undefined;
    // user.passwordResetExpires = undefined;

    // await user.save({ validateBeforeSave: false });
    return next(new AppError("there was error sending mail.Try again", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }
  });
  //2)If token has not expired and user exists then set the new password
  if(!user){
    return next(new AppError('Token is invalid or expired',400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //if we update the password we make reset token undefined
  user.passwordResetToken = undefined;

  await user.save();

  //3)update changed password property for the user
  //updated changedPassword field in DB using pre save method of mongoose

  //4) log the user in send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

