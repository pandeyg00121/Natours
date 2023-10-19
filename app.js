const fs=require('fs');

const morgan=require('morgan');
const express=require('express');
var bodyParser = require('body-parser');

const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const app=express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
//Morgan is 3rd party middleware from NPM and it helps us in getting URL,statusCode,HTTP method,time and space 
// e.g. "GET /api/v1/tours 200 8.574 ms - 8765" for getAllTour Route
// app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
//middleware to view static files

//    (1)creating middlewares by use method
app.use((req,res,next)=>{                   
    //use method is used to create middleware route
    //third argument is always nex as it specifies where the middleware moves
    console.log("hello from middleware");
    next();
});

app.use((req,res,next)=>{                   
    req.requestTime= new Date().toISOString();    
    //ISOString converts timestamp to readable string
    next();
});


//(3) ROUTES

app.use('/api/v1/tours',tourRouter);    //middleware 
    //this is called mounting a router on a route.
app.use('/api/v1/users',userRouter);

module.exports=app;
