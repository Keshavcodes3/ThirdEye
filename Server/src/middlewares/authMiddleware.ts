import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { JWTPayload } from "../modules/auth/auth.types";
import { ENV } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

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
