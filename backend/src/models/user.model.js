import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
        },

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String
    },
    bio:{
        type:String, 
        default:''

    },
    gender:{
        type:String,
        enum:['male','female']

    },
    followers:[
        {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
    ],
    following:[
        {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }

    ],
    posts:[
        {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Post'
    }

    ],
    bookmarks:[
        {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Post'
    }
],

   refreshToken:{
    type:String,
   }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) {
        return next()
    }
    this.password= await bcrypt.hash(this.password,10)
    next()

})

userSchema.methods.isPasswordCorrect=async function(password){
    
  return  await  bcrypt.compare(password,this.password)
} 


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // PAYLOAD GIVEN INFO TO BE KEPT
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
         // access token 
        process.env.ACCESS_TOKEN_SECRET,

        // expiry goes in object
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    // yhe baar baar refresh hota h usme info km hoti h
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model('User',userSchema)