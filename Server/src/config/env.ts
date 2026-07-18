import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV! || "development",
  PORT: process.env.PORT! || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!|| "access_secret_key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET! || "refresh_secret_key",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY! || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY! || "7d",
};
