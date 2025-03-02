import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { promises as fs } from "fs";
import path from "path";
import HealthReport, { IHealthReport } from "../models/healthReport.model.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const getPrompt = async (): Promise<string> => {
    const promptPath = path.join(process.cwd(), 'src', 'prompts', 'healthInsightsPrompt.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');
    return promptTemplate;
};

const cleanGeminiResponse = (responseText: string): string => {
    return responseText.replace(/```json\s*|\s*```/g, '').trim();
};

export const analyzeTestTrends = asyncHandler(async (req: Request, res: Response) => {
    try {
        const testTrends = req.body;
        
        if (!testTrends || Object.keys(testTrends).length === 0) {
            throw new ApiError(400, "No test trends data provided");
        }

        const promptTemplate = await getPrompt();
        const prompt = `${promptTemplate}\n${JSON.stringify(testTrends, null, 2)}`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        
        // Clean and parse response
        const cleanedResponse = cleanGeminiResponse(responseText);
        console.log("Cleaned Gemini Response:", cleanedResponse);

        let parsedInsights: IHealthReport;
        try {
            parsedInsights = JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("Failed to parse Gemini response:", cleanedResponse);
            throw new ApiError(500, "Invalid response format from AI");
        }

        // Create or update health report
        const healthReport = await HealthReport.findOneAndUpdate(
            { user_id: req.user._id },
            {
                user_id: req.user._id,
                health_trends: parsedInsights.health_trends,
                dietary_recommendations: parsedInsights.dietary_recommendations,
                lifestyle_suggestions: parsedInsights.lifestyle_suggestions,
                warnings: parsedInsights.warnings,
                supplements_medications: parsedInsights.supplements_medications,
                comparative_insights: parsedInsights.comparative_insights,
                additional_insights: parsedInsights.additional_insights
            },
            { new: true, upsert: true }
        );

        return res.status(200).json(
            new ApiResponse(200, healthReport, "Health insights generated and stored successfully")
        );

    } catch (error: any) {
        console.error("Error in analyzeTestTrends:", error);
        throw new ApiError(error.status || 500, error.message);
    }
});