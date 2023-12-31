const Tour=require('./../models/tourModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours=(req,res,next)=>{ 
    //route for most frequent request of top 5 tours
    req.query.limit='5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,duration,summary,ratingsAverage';
    next();
}

exports.getAllTour= catchAsync(async (req,res,next)=>{ 
    const features=new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status:'success',
        result: tours.length,
        data:{
            tours
        }
    });
});


exports.getTour= catchAsync(async (req,res,next)=>{   

    console.log(req.params);
    const tour = await Tour.findById(req.params.id);
    //const tour=await Tour.findOne({ _id:req.params.id });

    if (!tour) {
     return next(new AppError('No tour found with that ID', 404));
    } 

    res.status(200).json({
        status:'success',
        data:{
            tour
          }
    });
});

exports.createTour = catchAsync(async (req, res, next) => {

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour= catchAsync(async (req,res,next)=>{   

    const tour =await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
        //if this set to false then the built in validators will not be checked
    });

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
});


exports.deleteTour= catchAsync(async (req,res,next)=>{  

    const tour=await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({      
        status:'success',
        message:'user Deleted Successfully'
    });
});

exports.getTourStats = catchAsync(async (req, res,next) => {

      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            //groups on basis of _id parameters
            _id:  { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
          //sort on basis of avgPrice in ascending order 
        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
           stats
        }
      });
   
  });

  //to calculate how many tours start in each month of given year with tour names
  // i.e. in order to find busiest month
  exports.getMonthlyPlan = catchAsync(async (req, res,next) => {

      const year = req.params.year * 1; // 2021
  
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'    
        },
        {
          $match: {
            startDates: {
            // to bound in that year from 1 jan year to 31 dec year
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {   //project works as hide or show
            //anything with 0 in project is hidden in query
            _id: 0
          }
        },
        {
          $sort: { numTourStarts: -1 }
        },
        {
          $limit: 12    //for 12 months
        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
   
  });