import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();

// configure cors now
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
// handeling data coming from json 
app.use(express.json({
    limit:"20kb"
}))

// handeling data coming from url
app.use(express.urlencoded({
    extended:true,
    limit:"20kb"}))

// koi image favicon aaye to pulic folder m rklo for future use
app.use(express.static("public"))

// configure cookies now
app.use(cookieParser())

import userRouter from './routes/user.route.js'

app.use("/api/v1/users",userRouter)

export {app}