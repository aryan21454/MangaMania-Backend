import { User } from "../models/User.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

const generateAccessandRefreshToken = async(userId) =>
    {
       try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
       const refreshToken = await user.generateRefreshToken();
       user.refreshToken = refreshToken;
       await user.save({validateBeforeSave : false});
       return {accessToken, refreshToken}; 
       }
       catch(error)
       {
          throw new ApiError(500, "something went wrong while generating tokens");
       }
       
    };
export const registerUser = asyncHandler(async (req, res, next) => {
    const {email, username, password} = req.body;
    if ([email, username, password].some((field) => field?.trim() ==="")) {
        throw new ApiError(400, "Missing required fields")
    }
    const   existedUser = await User.findOne({
        $or : [{email},{username}]
    });
    if (existedUser) {
        throw new ApiError(400, "User already existed")
    }
    const user = await User.create({
        email,
         username : username.toLowerCase()
        , password
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser)   {
        throw new ApiError(500, "Something went wrong")
    }
    return res.status(201).json(new ApiResponse(201, "User created successfully", createdUser));

});

export const loginUser = asyncHandler(async (req, res, next) => {
    const {email, username, password} = req.body; 
    
    if (!email && !username) {
        throw new ApiError(400, "Missing required fields")
    }
    const user = await User.findOne({
        $or : [{email},{username}]
    });
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new ApiError(400, "password is not correct");
    }
    const {accessToken , refreshToken} = await generateAccessandRefreshToken(user._id);
    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        // httpOnly : true,
        // secure : true
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User logged in successfully", loggedinUser));

});
export const logoutUser = asyncHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id, {
        $set : {refreshToken : undefined}
     },{
        new : true
     });
  
  
     const options = {
        // httpOnly :true,
        // secure : true
       }
  
     return res.status(200).
     clearCookie("accessToken",options).
     clearCookie("refreshToken",options).
     json(new ApiResponse(200,"User logged out successfully"));
     
  
  });
  export const refreshAccessToken = asyncHandler(async(req,res,next)=>{

    const incomingRefreshToken  = req.cookies.refreshToken || req.body?.refreshToken
 
    if (!incomingRefreshToken)
    {
       throw new ApiError(401, "Unauthorized request");
    }
    try {
       const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
       const user = User.findById(decodedToken._id);
    
       if (!user)
       {
          throw new ApiError(401, "invalid refresh token");
       }
       if (incomingRefreshToken !== user?.refreshToken)
          {
             throw new ApiError(401, "invalid refresh token");
          }
       const {accessToken , newrefreshToken} =  await generateAccessandRefreshToken(user._id);
       const options = {
        //   httpOnly :true,
        //   secure : true
         }
       
       return res.status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",newrefreshToken,options)
       .json(new ApiResponse(200,"user login successfully",{
          accessToken,
          newrefreshToken : refreshToken
       }))
    } catch (error) {
       throw new ApiError(401,error?.message ||  "invalid refresh token");
       
    }
 });
 export const getAuthStatus = asyncHandler(async(req,res,next)=>{
    
    try {
        
        res.status(200).json(new ApiResponse(200,"success",req.user)); 
        
    }
    catch(err) {
        throw new ApiError(401, err?.message ||  "Unauthorized request");
    }


 });
