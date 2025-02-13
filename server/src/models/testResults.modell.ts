import mongoose, { Schema, Document } from "mongoose";

// Define interface for test records
interface ITestRecord {
  reportId: mongoose.Types.ObjectId;
  value: number;
  date: Date;
  status: "Low" | "Normal" | "High";
}

// Define interface for test results
interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  testName: string;
  testCategory: string;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  records: ITestRecord[];
  insights?: string; // Includes trend analysis + potential disease risk
  healthAdvice?: string; // Diet & lifestyle recommendations
  generatedGraph?: string;
}

// Schema for test records
const TestRecordSchema = new Schema<ITestRecord>({
  reportId: { type: Schema.Types.ObjectId, required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Low", "Normal", "High"], required: true },
});

// Schema for test results
const TestResultSchema = new Schema<ITestResult>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  testName: { type: String, required: true },
  testCategory: { type: String, required: true },
  unit: { type: String, required: true },
  referenceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  records: [TestRecordSchema],
  insights: { type: String }, // Updated insights for all reports
  healthAdvice: { type: String }, // Updated health advice for all reports
});

// Create and export the Mongoose model
const TestResult = mongoose.model<ITestResult>("TestResult", TestResultSchema);
export default TestResult;
