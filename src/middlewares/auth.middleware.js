import { User } from "../models/User.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { ApiError } from "../utilities/ApiError.js";

export const verifyJWT = asyncHandler(async (req,res,next) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log(req.cookies);
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
        throw new ApiError(401, err?.message ||  "Unauthorized request");
    }
})