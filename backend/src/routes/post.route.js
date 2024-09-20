import { addComment, addNewPost, BookMarkPosts, deletePost, DislikePosts, getAllPost, getCommentOfPost, getUserPost, LikePosts } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import  { Router } from "express"

const router=Router()

router.route("/addPost").post(verifyJWT,upload.single('image'),addNewPost)

router.route("/all").get(verifyJWT,getAllPost)

router.route("/UserPost/all").get(verifyJWT,getUserPost)

router.route("/:id/like").get(verifyJWT,LikePosts)

router.route("/:id/dislike").get(verifyJWT,DislikePosts)

router.route("/:id/comment").post(verifyJWT,addComment)

router.route("/:id/comment/all").post(verifyJWT,getCommentOfPost)

router.route("/delete/:id").post(verifyJWT,deletePost)

router.route("/:id/bookmark").post(verifyJWT,BookMarkPosts)

export default router