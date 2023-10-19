const mongoose=require('mongoose');

const tourSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A tour must have a name'],
        unique: true,
        trim:true
    },
    duration:{
        type: Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type: Number,
        required:[true,'A tour must have a group..']
    },
    difficulty:{
        type: String,
        required:[true,'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    //no of user rated
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true,'A tour must have a price']
    },
    priceDiscount: Number,
    summary:{
        type:String,
        trim:true       //removes space in beginning and end of Text
    },
    description:{
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false 
      //to always hide 
    },
    startDates: [Date]
});

const Tour=mongoose.model('Tour',tourSchema);
module.exports=Tour;