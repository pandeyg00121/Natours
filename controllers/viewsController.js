const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview= catchAsync( async (req, res) => {
    // 1) Get tour data from the collection
    const tours = await Tour.find();
    //2)render that complete data into template
    res.status(200).render("overview", {
      title: "All Tours",
      tours
    });
});

exports.getTour = catchAsync( async(req, res) => {
  //1) Get the data for req tour
  const tour = await Tour.findOne({slug:req.params.slug}).populate({
    path:'reviews',
    fields:'review rating user'
  });
  // console.log(tour.name);
    res.status(200).render("tour", {
      title: `${tour.name}`,
      tour
    });
});