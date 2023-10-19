
const express=require('express');

const Tour=require('./../models/tourModel');

exports.getAllTour= async (req,res)=>{ 
    try{
    //Build query
    //  1) FIltering
    const queryObj = {...req.query};
    console.log(req.query);
    const excludedFields= ['page','sort','limit','fields'];
    excludedFields.forEach( el => delete queryObj[el]);

    //  2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query=Tour.find(JSON.parse(queryStr));
    
    //3) Sorting
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }

    //4) field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v');   
        //'-__v' means excluding __v field
      }
    //Execute QUERY
    const tours = await query;

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
