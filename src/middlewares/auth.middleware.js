import { User } from "../models/User.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

export const verifyJWT = asyncHandler(async (req,res,next) =>{
    try {
        console.log(req.body);
        const token = req.header("Authorization")?.replace("Bearer ","")|| req.body?.accessToken;
        if (!token)
            {
                throw new ApiError("401","Invalid token");
            }
        
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

       
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) 
        {
            throw new ApiError(401, "Unauthorized request");
        }
        req.user = user;
        next();
    }
    catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(403).json({ message: 'Invalid token' });
        }
        throw new ApiError(401, err?.message ||  "Unauthorized request");
    }
})