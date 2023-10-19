
const express=require('express');

const Tour=require('./../models/tourModel');

// app.use(express.json());
exports.getAllTour= async (req,res)=>{ 
    try{
    const tours = await Tour.find();
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
