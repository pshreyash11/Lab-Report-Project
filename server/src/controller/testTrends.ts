import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import TestResult from "../models/testResults.model.js";

interface TrendData {
    date: string;
    value: number;
}

interface TestTrends {
    [testName: string]: TrendData[];
}

export const getTestTrends = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Fetch all test results for user
        const testResults = await TestResult.find({ 
            userId: req.user._id 
        });

        // Initialize trends object
        const trends: TestTrends = {};

        // Process each test result
        testResults.forEach(test => {
            const testName = test.testName.toLowerCase();
            
            // Initialize array if not exists
            if (!trends[testName]) {
                trends[testName] = [];
            }

            // Add records to trend data
            test.records.forEach(record => {
                trends[testName].push({
                    date: record.date.toISOString().split('T')[0],
                    value: record.value
                });
            });
        });

        // Sort each test's data by date
        Object.keys(trends).forEach(testName => {
            trends[testName].sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        });

        return res.status(200).json(
            new ApiResponse(200, trends, "Test trends retrieved successfully")
        );

    } catch (error: any) {
        throw new ApiError(500, error.message || "Error fetching test trends");
    }
});