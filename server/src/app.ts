import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Add request logging middleware 
// this is for testing only.
app.use((req, _res, next) => {
  console.log('Request Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS and cookie middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN as string|| 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.static("public"));

// Routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

export { app };