const fs=require('fs');

const morgan=require('morgan');
const express=require('express');
var bodyParser = require('body-parser');

const AppError=require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');

const app=express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
//middleware to view static files


app.use((req,res,next)=>{                   
    req.requestTime= new Date().toISOString();    
    //ISOString converts timestamp to readable string
    next();
});


//(3) ROUTES

app.use('/api/v1/tours',tourRouter);    //middleware 
    //this is called mounting a router on a route.
app.use('/api/v1/users',userRouter);

//for unhandled routes
app.all('*', (req,res,next) =>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // });

    //handling unhandled Routes through error handling middleware
    // const err= new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode=404;
    // err.status='fail';

    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports=app;
