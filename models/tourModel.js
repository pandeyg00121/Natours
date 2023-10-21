const mongoose=require('mongoose');
const slugify=require('slugify');

const tourSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A tour must have a name'],
        unique: true,
        trim:true,  //trim removes extra space in front or back of word
        maxLength : [40,'A tour must have less than or equal to 40 characters'],
        //these both are Vatidators
        minLength : [5,'A tour must have more than or equal to 5 characters'],
    },
    slug:String,
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
        default: 4.5,
        max : [5,'A tour must have less than or equal to 5 rating'],
        //these both are Vatidators
        min : [1,'A tour must have more than or equal to 1 rating'],

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
    startDates: [Date],
    secretTour:{
        type:Boolean,
        default:false
    }
    },
    {
        toJSON: {virtuals:true},    
        //to make virtual properties visible 
        toObject: {virtuals:true}
    }
);


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

// DOCUMENT MIDDLEWARE :runs before .save()
//this middleware is executed before any document is saved

tourSchema.pre('save',function(next){
    // console.log(this);
    this.slug= slugify(this.name,{lower:true});
    next();
});

// tourSchema.pre('save',function(next){
//     console.log('Will save document..');
//     next();
// });

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

//query Middleware
tourSchema.pre(/^find/,function(next){
    //filters the secret tours
    this.find({secretTour:{ $ne: true } });

    this.start=Date.now();
    next();
});

tourSchema.post(/^find/,function(docs,next){
    //filters the secret tours
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate',function(next){
    //
    this.pipeline().unshift({ $match:{secretTour:{$ne:true}}});
    console.log(this.pipeline());
    next();

});
const Tour=mongoose.model('Tour',tourSchema);
module.exports=Tour;