import dotenv from "dotenv";
import connectDB from "./db/index";
import { app } from "./app";

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