import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {Conversation} from "../models/conversation.model.js"
import {Messages} from "../models/message.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnClodinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

const sendMessges=asyncHandler(async(req,res)=>{
    const senderId=req.user.id 
    const reciverId=req.params.id
    const {message}=req.body
    let conversation=await Conversation.findOne({
        participants: {$all:[senderId,reciverId]}
    })
    if(!conversation){
        conversation= await  Conversation.create({
            participants:[senderId,reciverId]
        })
    }
    const newMessage=await Messages.create({
        senderId,
        reciverId,
        message
    })
   if(newMessage) conversation.messages.push(newMessage._id)
    await Promise.all([
        conversation.save(),
        newMessage.save()
    ])

    //implement socketsio 
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        newMessage,
        "Message sent successfully",
    ))
})

const getConversations = asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const {message}=req.body
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (conversation.length === 0) {
        throw new ApiError(404, "No conversation found");
    }
    
    const newMessage=await Messages.create({
        senderId,
        receiverId,
        message
    })
   if(newMessage) conversation.messages.push(newMessage._id)
    await Promise.all([
        conversation.save(),
        newMessage.save()
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                conversation,
                "Conversations retrieved successfully"
            )
        );
});

export {
    sendMessges,
    getConversations
}