const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true, //trim removes extra space in front or back of word
      maxLength: [40, "A tour must have less than or equal to 40 characters"],
      //these both are DATA Vatidators
      minLength: [5, "A tour must have more than or equal to 5 characters"],
      // validate: [validator.isAlpha, 'name can only alphabetical']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group.."],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      //in order to restrict difficulty to only three values we use enum
      //enum is only for strings
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy,medium or hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "A tour must have less than or equal to 5 rating"],
      //these both are DATA Vatidators
      min: [1, "A tour must have more than or equal to 1 rating"],
      //set used to round of ratingAverage
      set : val => Math.round(val*10) / 10  
      //val=4.666666 -> round(4.666666*10) -> round(46.6666) -> 47/10 -> 4.7 
    },
    //no of user rated
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "discount price ({VALUE}) should be less than actual price",
      },
    },
    summary: {
      type: String,
      trim: true, //removes space in beginning and end of Text
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
      //to always hide
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    //to make virtual properties visible
    toObject: { virtuals: true },
  }
);
//creating indexing
// tourSchema.index({price:1});
tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({ startLocation : '2dsphere'});

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//virtually populate reviews for a tour without storing reference to reviews
tourSchema.virtual('reviews', {
  ref : 'Review',
  foreignField : 'tour',
  localField : '_id'
});
// DOCUMENT MIDDLEWARE :runs before .save()
//this middleware is executed before any document is saved

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//used to embed users in to the tour object
// tourSchema.pre('save',async function(next){

//    const guidesPromises = this.guides.map( async id => await User.findById(id));
//    this.guides = await Promise.all(guidesPromises);
//     next();
// });

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

//query Middleware
///^find/ is a regular expression for all queries with "..find..." in them
tourSchema.pre(/^find/, function (next) {
  //filters the secret tours
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});
// query middleware to populate users/guides data in every tour's "..find..." method
tourSchema.pre(/^find/, function (next) {
  //select hides the properties with -sign
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //filters the secret tours
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//AGGREGATION MIDDLEWARE
// tourSchema.pre("aggregate", function (next) {
//   //
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
