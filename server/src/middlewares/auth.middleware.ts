/**
 * Middleware to verify JWT tokens and authenticate requests
 * 
 * @description
 * This middleware:
 * 1. Extracts JWT token from cookies or Authorization header
 * 2. Verifies the token using ACCESS_TOKEN_SECRET
 * 3. Finds the associated user in database
 * 4. Attaches user object to request
 * 
 * @example
 * ```typescript
 * app.get('/protected', verifyJWT, (req, res) => {
 *   // Access authenticated user via req.user
 * });
 * ```
 */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";

// Extend Express Request to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Interface for JWT decoded token
interface JwtPayload {
    _id: string;
    [key: string]: any;
}

export const verifyJWT = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Extracted token:", token);

        if (!token) {
            console.log("No token provided");
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as JwtPayload;
        console.log("Decoded token:", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log("User fetched from token:", user);

        if (!user) {
            console.log("Invalid access token, user not found");
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error: any) {
        console.log("Token verification error:", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});