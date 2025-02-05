import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

if (!process.env.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN environment variable is required');
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



//routes import
import userRouter from "./routes/user.routes.ts";

app.use("/api/v1/users",userRouter);


export { app };