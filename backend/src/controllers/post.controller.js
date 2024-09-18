import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnClodinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
 
const addNewPost=asyncHandler(async(req,res)=>{
    const {caption}=req.body;
    let ImagePath;
    const authorId=req.user.id
    if(req.files&& Array.isArray(req.files.Image)&& req.files.Image.length>0){
        ImagePath= req.files. Image[0].path;
         
       }
    if(!ImagePath) {
        throw new ApiError(400,"Image is required")
    }
    const Image=await uploadOnClodinary(ImagePath)

    const post=await Post.create({
        caption,
        Image: Image.url(),
        author:authorId
    })

  const user=await User.findById(authorId)
  if(!user) {
    throw new ApiError(404,"User not found")
}
     user.posts.push(post._id)
     await user.save()

     await post.populate(
        {
            path:"author",
            select:"-password"
        }
     )
     return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            "Post created successfully",
        )
     )

})

const getAllPost=asyncHandler(async(req,res)=>{
    const posts=await Post
    .find()
    .sort({createdAt:-1})
    .populate({path:'author',select:'username profilePicture'})
    .populate({
        path:'comments',
        sort:{createdAt:-1},
        populate:{
            path:'author',
            select:'username profilePicture'
            }
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        posts,
        "All posts retrieved successfully",
    ))
})

const getUserPost=asyncHandler(async(req,res)=>{
    const authorId=req.params.id
   const UserPosts= await Post.find({author:authorId})
    .sort({createdAt:-1})
    .populate({path:'author',select:'username profilePicture'})
    .populate({
        path:'comments',
        sort:{createdAt:-1},
        populate:{
            path:'author',
            select:'username profilePicture'
            }
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        UserPosts,
        "All posts retrieved successfully",
    ))

})

const LikePosts=asyncHandler(async(req,res)=>{
  const authorId=req.user.id
  const postId=req.params.id
  const post=await Post.findById(postId)
  if(!post) {
    throw new ApiError(404,"post do not exsist")
  }
   await post.updateOne({
    $addToSet:{
        likes:authorId
    }
  })
  await post.save();
  return res
  .status(200)
  .json(
        new ApiResponse(
        200,
        post,
        "Post liked successfully",
        )
  )
})

const DislikePosts=asyncHandler(async(req,res)=>{
    const authorId=req.user.id
    const postId=req.params.id
    const post=await Post.findById(postId)
    if(!post) {
      throw new ApiError(404,"post do not exsist")
    }
     await post.updateOne({
      $pull:{
          likes:authorId
      }
    })
    await post.save();
    return res
    .status(200)
    .json(
          new ApiResponse(
          200,
          post,
          "Post Disiked successfully",
          )
    )
})

const addComment=asyncHandler(async(req,res)=>{
    const authorId=req.user.id
    const postId=req.params.id
    const {text}=req.body
    const post=await Post.findById(postId)
    if(!post) {
      throw new ApiError(404,"post do not exsist")
    }
    if(!text){
        throw new ApiError(400,"text is required")
    }
    const comment=await Comment.create({
        text:text,
        authorId:authorId,
        postId:postId
    }).populate({
        path:"author",
        select:"username profilePicture"
    })
     await post.updateOne({
      $push:{
          comments:comment._id
      }
    })
    await post.save();
    return res
    .status(200)
    .json(
          new ApiResponse(
          200,
          post,
          " Comment Added successfully",
          )
    )
})

export {
    addNewPost,
    getAllPost,
    getUserPost,
    LikePosts,
    DislikePosts,
    addComment
}