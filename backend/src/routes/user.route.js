import  { Router } from "express"
import { editProfile, followOrUnfollow, getSuggestedUsers, GetUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/:id/getUserProfile").get(verifyJWT,GetUserProfile)
router.route("/edit/profile").post(verifyJWT,
   upload.fields([{
    name:"profilePicture",
    maxCount:1
}]),editProfile)
router.route("/suggested").get(verifyJWT,getSuggestedUsers)
router.route("/followOrUnfollow/:id").post(verifyJWT,followOrUnfollow)
export default router
 