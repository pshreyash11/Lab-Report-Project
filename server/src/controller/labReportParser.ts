import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { promises as fs } from "fs";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import path from "path";
import mongoose from "mongoose";
import TestResult, { ITestRecord } from "../models/testResults.model.js";
import dotenv from "dotenv";
dotenv.config();


interface ParsedResponse {
    testResults: {
      testName: string;
      testCategory: string;
      value: number;
      unit: string;
      referenceRange: {
        min: number | null;
        max: number | null;
      };
    }[];
    reportDate: string | null;
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const data = new Uint8Array(await fs.readFile(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ');
  }
  
  return text;
};

const extractTextFromDOC = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const getPrompt = async (): Promise<string> => {
    const promptPath = path.join(process.cwd(), 'src', 'prompts', 'labReportPrompt.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');
    return promptTemplate;
};

// Helper function to determine test status
const determineStatus = (value: number, min: number, max: number): "Low" | "Normal" | "High" => {
    if (value < min) return "Low";
    if (value > max) return "High";
    return "Normal";
};

const cleanGeminiResponse = (responseText: string): string => {
    // Remove markdown code block markers and any whitespace
    return responseText.replace(/```json\s*|\s*```/g, '').trim();
};

export const parseLabReport = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new ApiError(400, "No file uploaded");
        }
    
        let documentText: string;
        
        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            documentText = await extractTextFromPDF(req.file.path);
        } else if (req.file.mimetype === 'application/msword' || 
                    req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            documentText = await extractTextFromDOC(req.file.path);
        } else {
            throw new ApiError(400, "Unsupported file format");
        }
    
        console.log("Extracted text:", documentText);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptTemplate = await getPrompt();
        const prompt = `${promptTemplate}\n\nText: ${documentText}`;
    
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        
        // Clean response before parsing
        const cleanedResponse = cleanGeminiResponse(responseText);
        console.log("Cleaned Response:", cleanedResponse);

        // Add debug logging
        console.log("Raw Gemini Response:", responseText);
        let parsedData: ParsedResponse;
        try {
            // We need this JSON.parse because Gemini returns a string
            // even though the string contains JSON
            parsedData = JSON.parse(cleanedResponse);
            if (!parsedData.reportDate) {
                parsedData.reportDate = new Date().toISOString().split('T')[0];
            }
            if (!parsedData.testResults || !Array.isArray(parsedData.testResults)) {
                throw new Error('Invalid response structure');
            }
        
            // Validate each test result
            parsedData.testResults.forEach(test => {
                if (!test.testName || !test.testCategory || 
                    typeof test.value !== 'number' || !test.unit) {
                    throw new Error(`Invalid test result structure for ${test.testName}`);
                }
            });
        } catch (error) {
            console.error("Failed to parse Gemini response:", cleanedResponse);
            throw new ApiError(500, "Invalid response format from AI");
        }

        console.log("parsedData : ", parsedData);
        
        // Create reportId for this upload
        const reportId = new mongoose.Types.ObjectId();

        // Process each test result and update/create records
        const processedTests = await Promise.all(parsedData.testResults.map(async (test: any) => {
            // Find or create test result
            console.log('Processing test:', {
                name: test.testName,
                referenceRange: test.referenceRange
            });
            
            let testResult = await TestResult.findOne({
                userId: req.user._id,
                testName: test.testName
            });

            const referenceRange = {
                min: test.referenceRange?.min ?? 0, // Use nullish coalescing
                max: test.referenceRange?.max ?? 0
            };
        
            if (testResult) {
                // Add new record to existing test
                testResult.records.push({
                    reportId,
                    value: test.value,
                    date: new Date(parsedData.reportDate),
                    status: determineStatus(
                        test.value,
                        referenceRange.min,
                        referenceRange.max
                    )
                });
            }
            else {
                // Create new test with explicit referenceRange
                testResult = new TestResult({
                    userId: req.user._id,
                    testName: test.testName,
                    testCategory: test.testCategory,
                    unit: test.unit,
                    referenceRange: referenceRange, // Pass explicitly
                    records: [{
                        reportId,
                        value: test.value,
                        date: new Date(parsedData.reportDate),
                        status: determineStatus(
                            test.value,
                            referenceRange.min,
                            referenceRange.max
                        )
                    }]
                });
            }

            return testResult.save();
        }));

    await fs.unlink(req.file.path);

    return res.status(200).json(
        new ApiResponse(200, processedTests, "Lab report processed successfully")
    );

    } 
    catch (error: any) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

