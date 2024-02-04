const express = require("express");
const morgan = require("morgan");
const ratelimit = require("express-rate-limit");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
var bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// GLOBAL MIDDLEWARES------>

//Set security HTTP headers
app.use(helmet());
//for develpment and status code on console
app.use(morgan("dev"));
//for rate limiting of requests
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request at same time from your IP address..Hold your Horses!!",
});
app.use("/api", limiter);

//reading data from req.body
app.use(bodyParser.urlencoded({ limit: '10kb', extended: false }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );
//middleware to serve static files
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //ISOString converts timestamp to readable string
  next();
});

//(3) ROUTES
app.use("/api/v1/tours", tourRouter); //middleware
//this is called mounting a router on a route.
app.use("/api/v1/users", userRouter);

//for unhandled routes
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server`
  // });

  //handling unhandled Routes through error handling middleware
  // const err= new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode=404;
  // err.status='fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;
