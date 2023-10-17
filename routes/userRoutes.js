const fs=require('fs');
const express=require('express');

const getAllUser= (req,res)=>{
    //errror 500 means internal server Error
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}

const createUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}

const getUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}

const updateUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}

const deleteUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}

const router =express.Router();

router.route('/')
    .get( getAllUser)
    .post(createUser);

router.route('/:id')
    .get( getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports=router;