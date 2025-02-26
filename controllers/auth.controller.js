import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req,res,next) => {
    //Implement sign up logic here.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create user  
        const { name, email, password} = req.body;

        if(!name || !email || !password){
            const error = new Error('Please fill all the fields');
            error.status = 400;
            throw error;
        }
        //check if a user  already exists
        const existingUser = await User.findOne({ email});

        if(existingUser){
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        // Hash password
        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{name , email , password : hashedPassword}], { session });
        const token = jwt.sign({ userId : newUser[0]._id}, JWT_SECRET, { expiresIn : JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success : true,
            message : 'User created successfully',
            data : {
                token,
                user : newUser[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);    
    }
}

export const signIn = async (req,res,next) => {
    //Implement sign in logic here.
    try {
        const { email, password} = req.body;
        if(!email || !password){
            const error = new Error('Please fill all the fields');
            error.status = 400;
            throw error;
        }

        const user = await User.findOne({ email });
        console.log("🚀 ~ signIn ~ user:", user)
        if(!user){
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            const error = new Error('Invalid password');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({ userId : user._id}, JWT_SECRET, { expiresIn : JWT_EXPIRES_IN });
        res.status(200).json({
            success : true,
            message : 'User signed in successfully',
            data : {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req,res,next) => {
    //Implement sign out logic here.
    
}