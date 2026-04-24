import dotenv from "dotenv";
import path from "path";
import type { Config } from "../shared/types/config/index.js";
import { StringValue } from "ms";

// Docker mounts root .env as /app/.env.
// Local backend run can also read backend/.env if needed.
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export function validateEnv() {
  const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

validateEnv();

export const config: Config = {
  port: parseInt(process.env.PORT || "8000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL!,

  cors: {
    origin:
      process.env.CORS_ORIGIN ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiry:
      (process.env.ACCESS_TOKEN_EXPIRY as StringValue) || "15m",
    refreshTokenExpiry:
      (process.env.REFRESH_TOKEN_EXPIRY as StringValue) || "7d",
  },
};