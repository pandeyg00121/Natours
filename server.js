const mongoose=require('mongoose');
const dotenv = require('dotenv');
//requiring dotenv module

dotenv.config({ path: './config.env' });
//specifying the path of env variables file
const app = require('./app');
//to connect to cloud database
// const DB= process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

process.on('uncaughtException', err =>{
    console.log('Uncaught Exception ...');
    console.log(err.name ,err.message);
    process.exit(1);
});

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(() => console.log('DB connected Successfull....'));

const port=process.env.PORT || 3000;
// console.log(process.env);

const server = app.listen(port,()=>{
   
    const date = new Date(); // Get the current date and time
    const jsonString = JSON.stringify(date);
    console.log(jsonString);

    console.log(`App running at port: ${port}....`);

});

process.on('unhandledRejection',err =>{
    console.log('Unhandled Rejection...');
    console.log(err.name ,err.message);
    //close the server
    server.close(()=>{
        process.exit(1);
    //0 stands for success and 1 for uncaught exception
    });
});

