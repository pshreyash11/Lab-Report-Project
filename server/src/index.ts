import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is listening at port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err: Error) => {
        console.log("MONGO DB connection failed !!!", err);
    });