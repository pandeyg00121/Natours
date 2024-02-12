//import-dev-data.js is to import data from tours file to database

const fs=require('fs');
const mongoose=require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../models/tourModel');
const User=require('./../../models/userModel');
const Review=require('./../../models/reviewModel');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(() => console.log('DB connected Successfull....'));

//readfile
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json/`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json/`, 'utf-8'));

//import data into database
const importData = async () => {
    try {
      await Tour.create(tours);
      await User.create(users, {validateBeforeSave:false});
      await Review.create(reviews);
      console.log('Data successfully loaded!');
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
      await Tour.deleteMany(); 
      await User.deleteMany(); 
      await Review.deleteMany();  
      //no argument means delete all
      console.log('Data successfully deleted!');
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
console.log(process.argv);

  if (process.argv[2] === '--import') {
    importData();
  }
   else if (process.argv[2] === '--delete') {
    deleteData();
  }
