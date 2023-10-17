
const fs=require('fs');
const express=require('express');

const tours=JSON.parse(
    //reading file out of event loop 
fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
  
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }
    next();
};

exports.checkBody=(req,res,next)=>{
    console.log(req.body);
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
          status: 'fail',
          message: 'Missing name or price'
        });
      }
    next();
}
exports.getAllTour= (req,res)=>{                
    //route handler function
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results:tours.length,
        data:{
            tours
        }
    });
}


exports.getTour= (req,res)=>{                    
    //? in parameter means that it is not required i.e. we can run error free if we don't give that param    
    console.log(req.params);
    const id=req.params.id*1;
    const tour=tours.find(el =>el.id === id);
    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour
        }
    });
    
}


exports.createTour=(req,res)=>{                
    //route handler function
   console.log(req.body);

   const newId=tours[tours.length-1].id+1;                      
   //getting Id of last tour from file and create id+1 for new data
   const newTour=Object.assign({id:newId}, req.body);       
   //create new object after merging two existing objects

   tours.push(newTour);
   //pushing the newTour to tour array.

   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),
   err=>{     
    //by JSON.stringify() we convert normal JS object to Json Object.

    res.status(201).json({  
        //200 means okay and 201 means created.
        status:'sucess',
        data:{
            tour:newTour
        }
    });
   }
   );
}

exports.updateTour= (req,res)=>{                    

    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour:'Updated Data here..'
        }
    });

}


exports.deleteTour=(req,res)=>{                    

    res.status(204).json({      
        //204 code means no Content
        status:'success',
        data:null
    });
}
