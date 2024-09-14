import connectDB from "./db/index.js";
import { app } from "./app.js";
import  dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
   app.listen(process.env.PORT||8000,()=>{
       console.log(`Server is running on port : ${process.env.PORT}`)
   })
})
.catch((err)=>{
   console.log("Error connecting to database",err)
})