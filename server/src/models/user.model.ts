import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

// Export IUser interface
export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  age: number;
  gender: string;
  refreshToken?: string;
}

// Interface for User methods
interface IUserMethods {
  isPasswordCorrct(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Combined User type with methods
export type UserModel = IUser & IUserMethods;

interface TokenPayload {
  _id: mongoose.Types.ObjectId;
  email?: string;
  username?: string;
  fullname?: string;
}

const userSchema = new Schema<UserModel>({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrct = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const payload: TokenPayload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname,
  };

  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    } as SignOptions
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const payload: TokenPayload = {
    _id: this._id,
  };

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET || "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    } as SignOptions
  );
};

export const User = mongoose.model<UserModel>("User", userSchema);