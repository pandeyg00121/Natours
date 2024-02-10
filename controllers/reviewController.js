const Review =require('./../models/reviewModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllReviews= catchAsync(async (req,res,next)=>{ 
    let filter={};
    //GET( /tour/345678ugfdeyh9iu/reviews )
    //if there is a parameter in get review then find only that tours review
    if(req.params.tourId) 
    filter ={tour :req.params.tourId};

    const reviews = await Review.find(filter);


    res.status(200).json({
        status:'success',
        result: reviews.length,
        data:{
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    if(!req.body.tour)  req.body.tour=req.params.tourId;
    //req.user.id comes from protect route mounted on create Review
    if(!req.body.user)  req.body.user=req.user.id;

    const newReview = await Review.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
});