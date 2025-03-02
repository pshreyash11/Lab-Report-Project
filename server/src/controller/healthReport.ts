import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import HealthReport from "../models/healthReport.model.js";

export const getUserHealthReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await HealthReport.findOne({ user_id: req.user._id });
    if (!report) {
        throw new ApiError(404, "Health report not found");
    }
    return res.status(200).json(
        new ApiResponse(200, report, "Health report retrieved successfully")
    );
});

export const updateUserSymptoms = asyncHandler(async (req: Request, res: Response) => {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms)) {
        throw new ApiError(400, "Invalid symptoms data");
    }

    const report = await HealthReport.findOneAndUpdate(
        { user_id: req.user._id },
        { $set: { user_reported_symptoms: symptoms } },
        { new: true, upsert: true }
    );

    return res.status(200).json(
        new ApiResponse(200, report, "Symptoms updated successfully")
    );
});

export const updateUserMedications = asyncHandler(async (req: Request, res: Response) => {
    const { medications } = req.body;
    if (!medications || !Array.isArray(medications)) {
        throw new ApiError(400, "Invalid medications data");
    }

    const report = await HealthReport.findOneAndUpdate(
        { user_id: req.user._id },
        { $set: { user_medications: medications } },
        { new: true, upsert: true }
    );

    return res.status(200).json(
        new ApiResponse(200, report, "Medications updated successfully")
    );
});

export const deleteHealthReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await HealthReport.findOneAndDelete({ user_id: req.user._id });
    if (!report) {
        throw new ApiError(404, "Health report not found");
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Health report deleted successfully")
    );
});