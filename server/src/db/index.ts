import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MONGO_DB connection failed ", error);
        process.exit(1);
    }
};

export default connectDB;