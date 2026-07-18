import express from "express"
import authcontroller from "./auth.controller.js"
import { authMiddleware } from "../../middlewares/authMiddleware.js"
const authRoutes = express()

authRoutes.post('/register', authcontroller.registerUser)
authRoutes.post('/login', authcontroller.loginUser)
authRoutes.get('/get', authMiddleware, authcontroller.getUser)


export default authRoutes