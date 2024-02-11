const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const router = express.Router({ mergeParams: true });
router.use(express.json());

router.use(authController.protect); 
//POST( /tour/345678ugfdeyh9iu/reviews ) -->to create review for particular tour
//GET( /tour/345678ugfdeyh9iu/reviews )  -->to view review's of a particular tour
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(authController.restrictTo('admin','user'),reviewController.deleteReview)
  .patch(authController.restrictTo('admin','user'),reviewController.updateReview);

module.exports = router;
