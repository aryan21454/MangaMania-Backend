 import { ApiResponse } from "./ApiResponse.js";
 const asyncHandler = (fn) => async (req, res, next) =>
    {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log(error.message);
            if (error.message === "password is not correct")
                { 
                    // res.status(400).send("Incorrect password");
                    res.status(400).json(new ApiResponse(200,"Incorrect password"))
                    return ;
                }
            if (error.message === "User not found") {
                res.status(404).json(new ApiResponse(404,"User not found"))
                return ;
            }
            // register user errors
            if (error.message === "User already existed") {
                res.status(400).json(new ApiResponse(400,"User already existed"))
                return ;
            }
            res.status(500).json(new ApiResponse(200,'Internal Server Error'))
        }
    }
export {asyncHandler}