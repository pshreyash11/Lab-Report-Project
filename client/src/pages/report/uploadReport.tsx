import React, { useContext, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  UploadIcon,
  FileTextIcon,
  Loader2Icon,
  ArrowLeftIcon,
} from "lucide-react";

const UploadReport: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!userContext?.isLoggedIn) {
      navigate("/auth/login");
    }
  }, [userContext?.isLoggedIn, navigate]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    if (
      file.type !== "application/pdf" &&
      file.type !== "application/msword" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      toast.error("Invalid file format", {
        description: "Please upload a PDF or DOC file",
      });
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB",
      });
      return;
    }

    setFile(file);
    toast.success("File selected", {
      description: file.name,
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a report to upload",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("report", file);

    try {
      // Step 1: Parse the report
      const parseResponse = await axios.post(
        "http://localhost:8000/api/v1/users/parse-report",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (parseResponse.data?.success) {
        // Step 2: Analyze the trends using the parsed data
        try {
          await axios.post(
            "http://localhost:8000/api/v1/users/analyze-trends",
            parseResponse.data.data, // Send the parsed test data as input
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          toast.success("Report processed successfully", {
            description:
              "Your lab report has been analyzed and insights generated",
          });
        } catch (analysisError: any) {
          console.error("Analysis failed:", analysisError);
          toast.error("Health insights generation failed", {
            description:
              "Your report was uploaded but we could not generate insights",
          });
        }

        setTimeout(() => {
          navigate("/health-insights");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);

      toast.error("Upload failed", {
        description:
          error.response?.data?.message || "Could not process your report",
      });
    } finally {
      setIsUploading(false);
    }
  };
  // If context is loading or user is not logged in, show a loading state
  if (!userContext || !userContext.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeftIcon size={16} />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Upload Lab Report
        </h1>

        <Card className="p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <FileTextIcon size={48} className="text-blue-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <UploadIcon size={48} className="text-gray-400" />
                  <p className="text-lg font-medium text-gray-700">
                    Drag and drop your report here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX files (max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full h-12"
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload and Process Report"
              )}
            </Button>
          </div>

          <div className="mt-4 space-y-4 text-sm text-gray-500">
            <div>
              <p className="mb-2 font-medium">
                Our AI Analyzes Various Lab Tests:
              </p>
              <p className="mb-2">
                ReportLab supports comprehensive analysis of standard medical
                lab tests including but not limited to:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                <div>
                  <span className="text-blue-600">•</span> Complete Blood Count
                </div>
                <div>
                  <span className="text-blue-600">•</span> Liver Function Panel
                </div>
                <div>
                  <span className="text-blue-600">•</span> Lipid Profiles
                </div>
                <div>
                  <span className="text-blue-600">•</span> Kidney Function Tests
                </div>
                <div>
                  <span className="text-blue-600">•</span> Thyroid Function
                  Tests
                </div>
                <div>
                  <span className="text-blue-600">•</span> Diabetes Markers
                </div>
                <div>
                  <span className="text-blue-600">•</span> Vitamin Levels
                </div>
                <div>
                  <span className="text-blue-600">•</span> Electrolyte Panels
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium">How It Works:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Upload your lab report (PDF or DOC)</li>
                <li>Our AI extracts and analyzes your test results</li>
                <li>Get personalized health insights and recommendations</li>
                <li>Track your health trends over time with visual charts</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="font-medium text-blue-700">Privacy Assured</p>
              <p className="text-blue-600">
                Your health data is encrypted and never shared with third
                parties.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadReport;
