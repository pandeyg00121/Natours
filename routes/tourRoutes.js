const fs=require('fs');
const express=require('express');

const tourController=require('./../controllers/tourController');
const router =express.Router();
router.use(express.json());

// router.param('id',tourController.checkId);

router.route('/top-5-tours')
    .get(tourController.aliasTopTours,tourController.getAllTour)

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);
router.route('/')
    .get( tourController.getAllTour)
    .post(tourController.createTour);  
    //chaining multiple middleware to same POST request 
    //firstly written will be executed first and then next one

router.route('/:id')
    .get( tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports=router;