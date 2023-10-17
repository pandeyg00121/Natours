const fs=require('fs');
const morgan=require('morgan');
const express=require('express');

const app=express();

app.use(morgan('dev'));        
//Morgan is 3rd party middleware from NPM and it helps us in getting URL,statusCode,HTTP method,time and space e.g. "GET /api/v1/tours 200 8.574 ms - 8765" for getAllTour Route
app.use(express.json());

const tours=JSON.parse(
    //reading file out of event loop 
fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//    (1)creating middlewares by use method
app.use((req,res,next)=>{                   
    //use method is used to create middleware route
    //third argument is always nex as it specifies where the middleware moves
    console.log("hello from middleware");
    next();
});

app.use((req,res,next)=>{                   
    req.requestTime= new Date().toISOString();    
    //ISOString converts timestamp to readable string
    next();
});
//   (2) ROUTE HANDLERS
//reading all tours
const getAllTour= (req,res)=>{                
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

//reading an specific tour with a id given in parameter
const getTour= (req,res)=>{                    
    //? in parameter means that it is not required i.e. we can run error free if we don't give that param    
    console.log(req.params);

    const id=req.params.id*1;  //converting string to integer
    //
    const tour=tours.find(el =>el.id === id);
    //firstly checking that the id recieved is not larger than the size of array
    if(!tour){
       
        res.status(404).json({
            status:'failure',
            message:'Invalid ID'
        });
    }

    else{
   
    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour
        }
    });
    }
}

//creating a new tour
const createTour=(req,res)=>{                
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

//updating Tour Data
const updateTour= (req,res)=>{                    
    // console.log(req.params);

    const id=req.params.id*1;  
    //converting string to integer
    //
    const tour=tours.find(el =>el.id === id);
    //firstly checking that the id recieved is not larger than the size of array
    if(!tour){
       
        res.status(404).json({
            status:'failure',
            message:'Invalid ID'
        });
    }

    else{
   
    res.status(200).json({
        status:'success',
        // results:tours.length,
        data:{
            tour:'Updated Data here..'
        }
    });
    }
}

//deleting a specific tour 
const deleteTour=(req,res)=>{                    
    // console.log(req.params);

    const id=req.params.id*1;  
    //converting string to integer
    const tour=tours.find(el =>el.id === id);
    //firstly checking that the id recieved is not larger than the size of array
    if(!tour){
       
        res.status(404).json({  
            status:'failure',
            message:'Invalid ID'
        });
    }

    else{
   
    res.status(204).json({      
        //204 code means no Content
        status:'success',
        data:null
    });
    }
}

const getAllUser= (req,res)=>{
    //errror 500 means internal server Error
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}
const createUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}
const getUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}
const updateUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}
const deleteUser= (req,res)=>{
    res.status(500).json({
        status:'Error',
        message:'This Route is not YET defined'
    });
}
// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//other way of writing above 5 lines
//(3) ROUTES

const tourRouter =express.Router();
const userRouter =express.Router();

tourRouter('/')
    .get( getAllTour)
    .post(createTour);

tourRouter('/:id')
    .get( getTour)
    .patch(updateTour)
    .delete(deleteTour);

userRouter('/')
    .get( getAllUser)
    .post(createUser);

userRouter('/:id')
    .get( getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/tours',tourRouter);    //middleware 
    //this is called mounting a router on a route.
app.use('/api/v1/users',userRouter);

//(4) starting server
const port=3000;

app.listen(port,()=>{

    console.log(`App running at port: ${port}....`);

});