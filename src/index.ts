import bodyParser from "body-parser";
import * as dotenv from "dotenv";
 dotenv.config();

import express from "express"; 
const app = express();
import mongoose from "mongoose";  
import Router from "./Router/allRouters";
 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());   
 
app.use('/uitoux',Router); 

const mongoUrl : string = process.env.MongoURL || '';
mongoose.connect(mongoUrl).
then(()=> console.log('Mongo db connected...')).
catch((error)=> console.log('Error:', error));  

app.listen(process.env.PORT, ()=> 
    console.log("Server started to run on the port",process.env.PORT))