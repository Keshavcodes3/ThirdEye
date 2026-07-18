import { Document, type ObjectId } from "mongoose";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  // _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser { }

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isVerified?: boolean;
}

export interface JWTPayload {
  _id: ObjectId;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: Omit<IUser, "password" | "refreshToken">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
