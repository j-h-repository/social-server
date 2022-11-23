import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {readdirSync} from "fs";
const morgan = require("morgan");
require("dotenv").config();

import User from "./models/users";



const app = express();



//Set up the database connection
mongoose.connect(process.env.DATABASE,{})
    .then(()=>console.log("db connected"))
    .catch((err)=>console.log(err));

    //apply some middlewares with .use();
		app.use(express.json({limit:"5mb"}));
		app.use(express.urlencoded({extended:true}));
		app.use(cors({
            origin:[process.env.CLIENT_URL]
        }))

    //post request for registering the user
    readdirSync(`./routes`).map((r)=>app.use(`/api`, require(`./routes/${r}`)))

    //



            
    //create the port
		const port = process.env.PORT || 8000;
		app.listen(port,()=>{
            console.log(`server running on port ${port}`)})
