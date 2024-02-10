const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const router = express.Router( {mergeParams:true});
router.use(express.json());

//POST( /tour/345678ugfdeyh9iu/reviews ) -->to create review for particular tour
//GET( /tour/345678ugfdeyh9iu/reviews )  -->to view review's of a particular tour
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user'),reviewController.createReview);


module.exports=router;