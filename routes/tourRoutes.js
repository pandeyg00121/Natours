const fs=require('fs');
const express=require('express');

const tourController=require('./../controllers/tourController');
const router =express.Router();


router.param('id',tourController.checkId);

router.route('/')
    .get( tourController.getAllTour)
    .post(tourController.checkBody,tourController.createTour);  
    //chaining multiple middleware to same POST request 
    //firstly written will be executed first and then next one

router.route('/:id')
    .get( tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports=router;