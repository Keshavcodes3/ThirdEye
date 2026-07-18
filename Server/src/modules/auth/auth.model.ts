import mongoose, { Document, Model, Schema } from "mongoose";
import { type IUser, UserRole } from "./auth.types.js";

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;
