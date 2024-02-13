// review / rating / createdAt / ref to tour / ref to user
const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  //to show properties that are not stored in db but exist
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//one user can write one review on a particular tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//to populate tour name and user name from objectId
reviewSchema.pre(/^find/, function (next) {
  //select hides the properties with -sign
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //     path: "user",
  //     select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

//to link average rating and no of reviews from a review to tour model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
//as review is saved or created calcAverage triggers
reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//above we calculated real time review and rating for new reviews
//here we do the same for update and delete
// findByIdAndUpdate
// findByIdAndDelete
//by using below two we transfer data from pre query middleware to post query
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  // console.log(this.rev);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.review.constructor.calcAverageRatings(this.review.tour);
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
