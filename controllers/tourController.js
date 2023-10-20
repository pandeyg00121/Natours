
const express=require('express');

const Tour=require('./../models/tourModel');

exports.aliasTopTours=(req,res,next)=>{ 
    //route for most frequent request of top 5 tours
    req.query.limit='5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,duration,summary,ratingsAverage';

    next();
}

class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }

    filter(){
    //  1) FIltering
    const queryObj = {...this.queryString};
    const excludedFields= ['page','sort','limit','fields'];
    excludedFields.forEach( el => delete queryObj[el]);

    //  2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query  =  this.query.find(JSON.parse(queryStr));

    return this;
    //this is returned so that in query execution we should chain our methods
    }

    sort(){
        //3) Sorting
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
         //4) field limiting
       if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');   
        //'-__v' means excluding __v field
      }
        return this;
    }

    paginate() {
        //5) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
    
        this.query = this.query.skip(skip).limit(limit);
    
        return this;
      }

}
exports.getAllTour= async (req,res)=>{ 
    try{
    //Execute QUERY

    const features=new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort().
        limitFields().
        paginate();

    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status:'success',
        result: tours.length,
        data:{
            tours
        }
    });
  }
  catch(err){
    res.status(404).json({  
        status:'fail',
        message:'Not Found'
    });  
  }
}


exports.getTour= async (req,res)=>{                    
    console.log(req.params);
    try{
        const tour = await Tour.findById(req.params.id);
        //const tour=await Tour.findOne({ _id:req.params.id });

        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
      }
      catch(err){
        res.status(404).json({  
            status:'fail',
            message:'Not Found'
        });  
      }
}


exports.createTour=async (req,res)=>{  
    console.log(req.body);
  try{
    // one way of adding data 
    // const newTour=new Tour({name:String,price:Number}).then().catch();
    // newTour.save();           
    
    // another way
    const newTour= await Tour.create(req.body);
    console.log(req.body);
    res.status(201).json({  
        status:'sucess',
        data:{
            tour: newTour
        }
    });
   }
   catch(err){
    res.status(404).json({  
        status:'fail',
        message:'invalid data sent'
    });  
   }
}

exports.updateTour= async (req,res)=>{                    
try{
    const tour =await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
    });
    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour
        }
    });
}
catch(err){
    res.status(404).json({  
        status:'fail',
        message:err
    });  
}
}


exports.deleteTour= async (req,res)=>{  
try{                  
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({      
        status:'success',
        message:'user Deleted Successfully'
    });
 }
 catch(err){
    res.status(404).json({
        status: 'fail',
        message: err
      });
 }
}
