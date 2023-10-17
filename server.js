
const dotenv = require('dotenv');
//requiring dotenv module
dotenv.config({ path: './config.env' });
//specifying the path of env variables file

const app = require('./app');
const port=process.env.PORT || 3000;
// console.log(process.env);

app.listen(port,()=>{

    console.log(`App running at port: ${port}....`);

});