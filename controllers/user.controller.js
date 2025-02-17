import User from "../models/user.model.js";

export const getUsers = async (req,res,next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({success:true,data:users});
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req,res,next) => {
    try {
        const {id} = req.params;
        const users = await User.findById(id).select("-password");

        if(!users){
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({success:true,data:users});
    } catch (error) {
        next(error)
    }
}