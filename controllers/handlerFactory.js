const APIFeatures=require('./../utils/apiFeatures');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createOne = Model =>  catchAsync(async (req, res, next) => {

    const newDoc = await Model.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
         newDoc
      }
    });
  });

exports.updateOne = Model=> catchAsync(async (req,res,next)=>{   

    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
        //if this set to false then the built in validators will not be checked
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    });
});

exports.deleteOne = Model=> catchAsync(async (req,res,next)=>{  

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({      
        status:'success',
        data: null,
        message:'Document Deleted Successfully'
    });
});

exports.getOne = (Model,popOptions)=> catchAsync(async (req,res,next)=>{   
    let query = Model.findById(req.params.id);
    if(popOptions)
    query = query.populate('reviews');

    const doc = await query;

    if (!doc) {
     return next(new AppError('No document found with that ID', 404));
    } 

    res.status(200).json({
        status:'success',
        data:{
            doc
          }
    });
});

exports.getAll = Model => catchAsync(async (req,res,next)=>{ 
    
    //GET( /tour/345678ugfdeyh9iu/reviews ) (to allow nested GET)
    //if there is a parameter in get review then find only that tours review
    let filter={};
    if(req.params.tourId) 
    filter ={tour :req.params.tourId};

    const features=new APIFeatures(Model.find(filter),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    
    // SEND RESPONSE
    res.status(200).json({
        status:'success',
        result: doc.length,
        data:{
            data : doc
        }
    });
});