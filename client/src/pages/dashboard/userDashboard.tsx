import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const UserDashboard: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not logged in
    if (!userContext?.isLoggedIn) {
      navigate("/auth/login");
    }
  }, [userContext?.isLoggedIn, navigate]);

  // If context is loading or user is not logged in, show a loading state
  if (!userContext || !userContext.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              ReportLab Dashboard
            </h1>
            <button
              onClick={() => {
                userContext.setIsLoggedIn(false);
                userContext.setUser(null);
                navigate("/auth/login");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Hello, {userContext.user.fullname}! 👋
          </h2>
          <p className="text-gray-600">
            Welcome to your health dashboard. Here you can manage your lab
            reports and track your health metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Upload Report
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your lab reports for analysis
            </p>
            <button
              onClick={() => navigate("/upload-report")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              View Health Trends
            </h3>
            <p className="text-gray-600 mb-4">
              Track changes in your lab results over time
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              View Trends
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Health Insights
            </h3>
            <p className="text-gray-600 mb-4">
              Get AI-powered health recommendations
            </p>
            <button
              onClick={() => navigate("/health-insights")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Insights
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
