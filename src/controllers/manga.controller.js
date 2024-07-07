import Manga from "../models/Manga.js";
import { User } from "../models/User.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
export const addManga = asyncHandler(async(req,res,next)=>{
    
        const {name , type , chapter , linktoread } = req.body;
        console.log(req.body);
    const existingUser = await User.findById(req.user?._id);
    if (!existingUser)
        {
            throw new ApiError(401, "Unauthorized request");   
        }
        const manga = new Manga({
            name,
            type: type.toLowerCase(),
            chaptersRead: chapter,
            linkToRead: linktoread,
            user: [existingUser._id]
        });
        await manga.save();
        existingUser.list.push(manga);
        await existingUser.save();  
        res.status(200).json(new ApiResponse(200,"Manga added successfully",manga)); 
});
export const updateManga = asyncHandler(async(req,res,next)=>{
    
   try {
     const {name , type , chapter , linktoread } = req.body;
     console.log(req.body);
     console.log(name,type,chapter,linktoread)
     const existingUser =  User.findById(req.user._id);
     if (!existingUser)
         {
             throw new ApiError(401, "Unauthorized request");   
         }
     const updates = {
         name : name,
         type : type,
         chaptersRead : chapter,
         linkToRead : linktoread,
     }
     const manga = await Manga.findByIdAndUpdate(req.params.id, updates, { new: true });
    //  console.log(manga);
     res.status(201).json(new ApiResponse(201,"Manga updated successfully",manga));
   } catch (error) {
    console.log(error)
    
   }
});
export const deleteManga = asyncHandler(async(req,res,next)=>{
    try {
    const id = req.user._id;
    const existingUser = await User.findByIdAndUpdate(id, { $pull: { list: req.params.id } });
    if (!existingUser)
        {
            throw new ApiError(401, "Unauthorized request");   
        }
    const manga = await Manga.findByIdAndDelete(req.params.id);
    res.status(201).json(new ApiResponse(201,"Manga deleted successfully",manga));   
    } catch (error) {
        console.log(error);   
    }

});

export const getManga = asyncHandler(async(req,res,next)=>{
    try {
        const id = req.user._id;
        const list = await Manga.find({user: id}); 
        if (list.length === 0)
        {
            res.status(200).json(new ApiResponse(200,"No manga found",[]));
            return ;
        }
        res.status(200).json(new ApiResponse(200,"Manga list",list));
    } catch (error) {
        console.log(error);
    }
});
