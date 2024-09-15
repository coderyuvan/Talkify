import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Log cookies and Authorization header for debugging
        console.log('Cookies:', req.cookies); 
        console.log('Authorization Header:', req.header("Authorization")); 
        
        const token =   await req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        
        console.log('Token:', token); // Log the extracted token

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;  // Add user to request object
        next();
    } catch (error) { 
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
