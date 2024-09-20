import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getConversations, sendMessges} from "../controllers//message.controller.js"
const router=Router()
router.route('/send/:id').post(verifyJWT,sendMessges);
router.route('/all/:id').get(verifyJWT,getConversations);
export default router