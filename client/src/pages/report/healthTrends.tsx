import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../components/ui/card";

// Define interface based on the test trends response structure
interface TrendData {
  date: string;
  value: number;
}

interface HealthReportData {
  [testName: string]: TrendData[];
}

const HealthTrends = () => {
  const [healthData, setHealthData] = useState<HealthReportData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/test-trends",
          {
            withCredentials: true  // This enables sending cookies with the request
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Health Trends</h1>

      {loading && <p>Loading health data...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && Object.keys(healthData).length === 0 && (
        <p>No health reports found. Upload your first report to see trends.</p>
      )}

      {Object.keys(healthData).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(healthData).map(([testName, trends]) => (
            <Card key={testName} className="p-4">
              <h2 className="text-lg font-semibold">Test Name: {testName}</h2>
              <ul className="text-sm text-gray-500">
                {trends.map((trend, index) => (
                  <li key={index}>
                    Date: {new Date(trend.date).toLocaleDateString()}, Value:{" "}
                    {trend.value}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthTrends;
