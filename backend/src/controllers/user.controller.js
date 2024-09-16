import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnClodinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
 
 

const  generateAccessAndRefreshToken=async(userId)=>{

   try {
     const user= await User.findById(userId)
     const AccessToken=   user.generateAccessToken()
     const RefreshToken=   user.generateRefreshToken()
     
     user.refreshToken = RefreshToken;
     await user.save({validateBeforeSave:false});

    
     return {AccessToken,RefreshToken}

   } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh and access token")
   }

}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (
        [ username ,  email ,  password ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(401, "All Fields Are Required")
    }

    const user= await User.findOne({email})

    if(user){
        throw new ApiError(400,"user already exsist")
    }

   const createdUser= await User.create({
        username,
        email,  
        password,
    })

    if(!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }

    return res
    .status(201)
    .json(new ApiResponse (
        201,
        createdUser,
        "User created successfully",
    ))

})


const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    if (
        [ email ,  password ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(401, "All Fields Are Required")
    }

  const user=  await User.findOne({
        email
    })
    if(!user){
        throw new ApiError(401,"User do not exsist")
    }

    const VerifiedPassword= await user.isPasswordCorrect(password)
    if(!VerifiedPassword){
        throw new ApiError(401,"Invalid Password")
        }


    const {AccessToken,RefreshToken}= await generateAccessAndRefreshToken(user._id)
 
    const LoggedInUser= await User.findById(user._id).select("-password")

    const options={
        httpsOnly:true,
        secure:true,
      }

      return res
      .status(200)
      .cookie("refreshToken", RefreshToken, options)
      .cookie("accessToken",AccessToken,options)
      .json(new ApiResponse (
        200,
        {
        user:LoggedInUser,AccessToken,RefreshToken,
        },
        "User logged in successfully",
        ))
})

const logoutUser=asyncHandler(async(req,res)=>{
   await  User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: { refreshToken:1 }
        },
        {
            new:true
        }
    )
  
    const options={
        httpOnly:true,
        secure:false,
      }

      return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken",options)
       
      
      .json(new ApiResponse (
        200,
        {},
        "User logged out successfully",
        ))

})

const GetUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select("-password")

    if (!user) {
        return res.status(404).json({ 
            message: "User not found" 
        });
    }
    return res.json(new ApiResponse (
        200,
        user,
        "User profile retrieved successfully",
        ))
})

const editProfile=asyncHandler(async(req,res)=>{
    const{bio,gender}=req.body
    if(!bio || !gender) {
        throw new ApiError(400,"all fields are required")
    }
    const profilePicPath=req.file?.path
    if(!profilePicPath) {
        throw new ApiError(400,"profile picture is required")
    }
    const profilePic=uploadOnClodinary(profilePicPath)
    if(!profilePic.url) {
        throw new ApiError(400,"profile picture upload failed")
    }

    const user=await User.findByIdAndUpdate(
        req.user?.id,
        {
            $set:{
                bio:bio,
                gender:gender,
                profilePic:profilePic.url
            }
        },
        {
            new:true
        }
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse (
        200,
        user,
        "Profile updated successfully",
        ))
})

const getSuggestedUsers=asyncHandler(async(req,res)=>{
 const suggestedUser=   await User.find({
        _id:{
            $ne:req.user?.id
            }
            
    }).select("-password")

    if(!suggestedUser) {
        throw new ApiError(404, "No users found")
    }
    return res
    .status(201)
    .json(new ApiResponse (
        201,
        suggestedUser,
        "Suggested Users Found Succesfully"
    ))
})

const followOrUnfollow=asyncHandler(async(req,res)=>{
    // follower=>jo follow kr rha h
    // follows=>jisko follow kr rha h
    const follwer=req.user.id;
    const follows=req.params.id

    if(follwer===follows) {
        throw new ApiError(400, "You can't follow yourself")
    }

    const user=await User.findById(follwer)
    const targetUser=await User.findById(follows)
    if(!user  || !targetUser){
        throw new ApiError(404, "User not found")
    }

    const isfollowing=user.following.includes(follows)
    if(isfollowing) {
        // unfollow 
        await Promise.all([
            User.updateOne({_id:follwer},{$pull:{following:follows}}),
            User.updateOne({_id:follows},{$pull:{followers:follwer}}),
        ])
        return res
        .status(200)
        .json(new ApiResponse (
            200,
            "Unfollowed Successfully"
        ))
    }
    else{
        //follow
        await Promise.all([
            User.updateOne({_id:follwer},{$push:{following:follows}}),
            User.updateOne({_id:follows},{$push:{followers:follwer}}),
        ])
        return res
        .status(200)
        .json(new ApiResponse (
            200,
            "followed Successfully"
        ))

    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    GetUserProfile,
    editProfile,
    getSuggestedUsers,
    followOrUnfollow
}