import { z } from "zod";
import { UserRole } from "./auth.types.js";

export const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export const updateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).max(100).optional(),
    role: z.enum([UserRole.USER, UserRole.ADMIN]).optional(),
    isVerified: z.boolean().optional(),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export const paramsSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
