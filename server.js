const mongoose=require('mongoose');
const dotenv = require('dotenv');
//requiring dotenv module
const app = require('./app');
dotenv.config({ path: './config.env' });
//specifying the path of env variables file

//to connect to cloud database
// const DB= process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );


mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log('DB connected Successfull....'));

const tourSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price:{
        type: Number,
        required: [true,'A tour must have a price']
    }
});

const Tour=mongoose.model('Tour',tourSchema);

//to add new data in tours collection
const testTour=new Tour({
    name:'The hiker 3',
    // rating:4.7,
    price: 497
});

testTour.save().then(doc => {
    console.log(doc);
})
.catch(err => {
    console.log('Error :',err);
});
const port=process.env.PORT || 3000;
// console.log(process.env);

app.listen(port,()=>{

    console.log(`App running at port: ${port}....`);

});