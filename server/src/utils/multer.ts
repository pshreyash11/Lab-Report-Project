import multer, { StorageEngine, Multer, FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "./ApiError.js";

// Define allowed file types
const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const storage: StorageEngine = multer.diskStorage({
    destination: function(
        _req: Request, 
        _file: Express.Multer.File, 
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, "./public/temp");
    },
    filename: function(
        _req: Request, 
        file: Express.Multer.File, 
        cb: (error: Error | null, filename: string) => void
    ) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    if (!allowedFileTypes.includes(file.mimetype)) {
        cb(new ApiError(400, 'Only PDF and DOC files are allowed'));
        return;
    }
    cb(null, true);
};

export const upload: Multer = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});