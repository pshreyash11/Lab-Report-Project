import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { User } from "../../models/user.model.ts";
import { ApiResponse } from "../../utils/ApiResponse.ts";
import { generateAccessAndRefreshTokens } from "../auth/signup.controller.ts";

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
      throw new ApiError(400, "Username or email is required!");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrct(password);

    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      (user._id as string).toString()
    );

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in Successfully"
        )
      );
  }
);


const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  // we can use req.user because we have written our new middleware "auth.middleware.js" which gives access of user only by by accessToken
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $set: {
              refreshToken:undefined
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out"))

})

export { loginUser , logoutUser };