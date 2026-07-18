import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import type { JWTPayload } from "../modules/auth/auth.types.js";
import { ENV } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      user: JWTPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request { }

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid token");
  }
};