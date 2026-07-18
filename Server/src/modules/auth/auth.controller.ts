import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import authRepository from "./auth.repository.js";
import authutils from "./auth.utils.js";
import { apiSuccessResponse } from "../../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { ENV } from "../../config/env.js";
class authController {
    registerUser = asyncHandler(async (req: Request, res: Response) => {
        const { email, username, password } = req.body
        const exist = await authRepository.findUserByEmail(email)
        if (exist) throw new ApiError(400, "user already exist")
        const hashedPassword = await authutils.hashPassword(password)
        const user = await authRepository.createUser({
            email,
            username,
            password: hashedPassword
        })
        return res.status(200).json(apiSuccessResponse(200, "User created successfully", user))
    })

    loginUser = asyncHandler(async (req: Request, res: Response) => {
        const { email, username, password } = req.body
        const user = await authRepository.findUserByEmail(email)
        if (!user) throw new ApiError(404, "user not found")
        const passwordMatched = await authutils.comparePassword(password, user.password)
        if (!passwordMatched) throw new ApiError(400, "password not matched")
        else {
            const token = jwt.sign({
                userID: user._id,
                username: user.username
            }, ENV.JWT_ACCESS_SECRET, { expiresIn: "7d" })
            await authutils.setCookies(res, token)
        }
        return res.status(200).json(apiSuccessResponse(200, "user logged in successfully",user))

    })

    getUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.userID
        if (!userId) throw new ApiError(400, "userID not found , log in first")
        const user = await authRepository.findById(userId)
        if (!user) throw new ApiError(404, "user not found")
        return res.status(200).json(apiSuccessResponse(200, "user found successfully", user))
    })

}


const authcontroller = new authController()

export default authcontroller