import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define interface based on the test trends response structure
interface TrendData {
  date: string;
  value: number;
}

interface ChartData {
  date: string;
  value: number;
  formattedDate: string;
}

interface HealthReportData {
  [testName: string]: TrendData[];
}

// Array of colors for different line charts
const CHART_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a4de6c",
  "#d0ed57",
];

const HealthTrends = () => {
  const [healthData, setHealthData] = useState<HealthReportData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/test-trends",
          {
            withCredentials: true, // This enables sending cookies with the request
          }
        );
        console.log("Health report data:", response.data);
        setHealthData(response.data.data || {});
        setError(null);
      } catch (err) {
        console.error("Error fetching health reports:", err);
        setError("Failed to fetch health reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthReports();
  }, []);

  // Function to prepare chart data and ensure it's sorted by date
  const prepareChartData = (trends: TrendData[]): ChartData[] => {
    return trends
      .map((trend) => ({
        date: trend.date,
        value: trend.value,
        formattedDate: new Date(trend.date).toLocaleDateString("en-GB"), // Change to en-GB locale for DD/MM/YYYY format
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeftIcon size={16} />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Health Trends</h1>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && Object.keys(healthData).length === 0 && (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No Health Trends Available
            </h2>
            <p className="text-gray-600 mb-6">
              We don't have any health data to display yet. Please upload a lab
              report first.
            </p>
            <Button onClick={() => navigate("/upload-report")}>
              Upload Lab Report
            </Button>
          </Card>
        )}

        {Object.keys(healthData).length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(healthData).map(([testName, trends], index) => {
              // Skip if there's only one data point (can't make a line chart)
              if (trends.length <= 1) return null;

              const chartData = prepareChartData(trends);
              const colorIndex = index % CHART_COLORS.length;
              const lineColor = CHART_COLORS[colorIndex];

              return (
                <Card key={testName} className="p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Test: {testName}
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="formattedDate"
                          label={{
                            value: "Date",
                            position: "insideBottomRight",
                            offset: -10,
                          }}
                        />
                        <YAxis
                          label={{
                            value: "Value",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}`, "Value"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={testName}
                          stroke={lineColor}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-md font-medium">Data Points:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {chartData.map((point, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="font-medium">
                            {point.formattedDate}:
                          </span>{" "}
                          {point.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTrends;
