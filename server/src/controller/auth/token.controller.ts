import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../../models/user.model.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { ApiResponse } from "../../utils/ApiResponse.ts";

/**
 * Generates access and refresh tokens for a given user ID.
 * @param userId - The string representation of the user's ID.
 * @returns A promise that resolves with an object containing both tokens.
 * @throws ApiError if the user is not found or if token generation fails.
 */
export const generateAccessAndRefreshTokens = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

interface RefreshTokenPayload {
  _id: string;
}

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request, No incoming refresh token");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as RefreshTokenPayload;

      const user = await User.findById(decodedToken._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used.");
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      // Ensure user._id is defined and convert it to string
      const userId = user._id ? user._id.toString() : "";
      if (!userId) {
        throw new ApiError(500, "User ID is missing");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(userId);

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
          )
        );
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  }
);