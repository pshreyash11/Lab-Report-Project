import { Request, Response } from "express";
import { User } from "../../models/user.model.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { ApiResponse } from "../../utils/ApiResponse.ts";
import { generateAccessAndRefreshTokens } from "./token.controller.ts"; // Import from token.controller.ts


const registerUser = asyncHandler(async (req: Request, res: Response) => {
  console.log("Received form data:", req.body);
  const { fullname, email, username, password, gender, dateOfBirth} = req.body;

  if (
    [fullname, email, username, password, gender,dateOfBirth].some(
      (field) => String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }


  const user: any = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    gender,
    dateOfBirth
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id.toString()
  );

  // Remove password and refreshToken
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  /**
   * Cookie options configuration for secure HTTP-only cookies.
   * @property {boolean} httpOnly - Prevents client-side access to the cookie through JavaScript
   * @property {boolean} secure - Ensures cookie is only sent over HTTPS connections
   */
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User registered Successfully."
      )
    );
});

export { generateAccessAndRefreshTokens, registerUser };