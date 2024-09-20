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

//routes import
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import messageRouter from './routes/message.route.js'

//routes declared
app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/messages",messageRouter)

export {app}