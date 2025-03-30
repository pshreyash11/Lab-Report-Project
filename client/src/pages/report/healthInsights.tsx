import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, AlertCircleIcon, HeartPulseIcon, SoupIcon, DumbbellIcon, PillIcon } from 'lucide-react';

interface HealthTrend {
  test_name: string;
  observation: string;
  trend_analysis: string;
  _id: string;
}

interface DietaryRecommendation {
  deficiency: string;
  recommended_foods: string[];
  _id: string;
}

interface LifestyleSuggestion {
  condition: string;
  exercise_activity: string;
  _id: string;
}

interface Warning {
  test_name: string;
  critical_level: string;
  suggested_action: string;
  _id: string;
}

interface SupplementsMedication {
  deficiency: string;
  suggested_supplement: string;
  caution: string;
  _id: string;
}

interface ComparativeInsight {
  test_name: string;
  previous_value: string;
  current_value: string;
  change_analysis: string;
  _id: string;
}

interface HealthReport {
  _id: string;
  user_id: string;
  health_trends: HealthTrend[];
  dietary_recommendations: DietaryRecommendation[];
  lifestyle_suggestions: LifestyleSuggestion[];
  warnings: Warning[];
  supplements_medications: SupplementsMedication[];
  comparative_insights: ComparativeInsight[];
  additional_insights: string;
  user_reported_symptoms: string[];
  user_medications: string[];
}

const HealthInsights: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!userContext?.isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    fetchHealthInsights();
  }, [userContext?.isLoggedIn, navigate]);

  const fetchHealthInsights = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8000/api/v1/users/health-report',
        { withCredentials: true }
      );

      if (response.data?.success) {
        setHealthReport(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch health insights:', error);
      toast.error('Failed to load health insights', {
        description: error.response?.data?.message || 'Please try again later'
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!healthReport) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeftIcon size={16} />
            Back to Dashboard
          </Button>

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Health Insights Available</h2>
            <p className="text-gray-600 mb-6">
              We don't have any health insights for you yet. Please upload a lab report first.
            </p>
            <Button onClick={() => navigate('/upload-report')}>
              Upload Lab Report
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeftIcon size={16} />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Health Insights</h1>
        
        {/* Overall Insights */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <HeartPulseIcon size={24} className="mr-2 text-blue-600" />
            Overall Health Assessment
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{healthReport.additional_insights}</p>
        </Card>

        {/* Warnings Section */}
        {healthReport.warnings.length > 0 && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
              <AlertCircleIcon size={24} className="mr-2 text-red-600" />
              Important Health Warnings
            </h2>
            <div className="space-y-4">
              {healthReport.warnings.map(warning => (
                <div key={warning._id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-red-700">{warning.test_name}: {warning.critical_level}</h3>
                  <p className="mt-1 text-gray-700">{warning.suggested_action}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Health Trends */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Health Trends</h2>
          <div className="space-y-4">
            {healthReport.health_trends.map(trend => (
              <div key={trend._id} className="border-b pb-4">
                <h3 className="font-medium text-blue-700">{trend.test_name}</h3>
                <p className="text-gray-600 text-sm">Current Value: {trend.observation}</p>
                <p className="mt-1 text-gray-700">{trend.trend_analysis}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Dietary Recommendations */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <SoupIcon size={24} className="mr-2 text-green-600" />
            Dietary Recommendations
          </h2>
          <div className="space-y-4">
            {healthReport.dietary_recommendations.map(recommendation => (
              <div key={recommendation._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800">{recommendation.deficiency}</h3>
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Recommended Foods:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {recommendation.recommended_foods.map((food, index) => (
                      <span 
                        key={index} 
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lifestyle Suggestions */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <DumbbellIcon size={24} className="mr-2 text-purple-600" />
            Lifestyle Recommendations
          </h2>
          <div className="space-y-4">
            {healthReport.lifestyle_suggestions.map(suggestion => (
              <div key={suggestion._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800">{suggestion.condition}</h3>
                <p className="mt-1 text-gray-700">{suggestion.exercise_activity}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Supplements & Medications */}
        {healthReport.supplements_medications.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <PillIcon size={24} className="mr-2 text-amber-600" />
              Supplements & Medications
            </h2>
            <div className="space-y-4">
              {healthReport.supplements_medications.map(supplement => (
                <div key={supplement._id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800">{supplement.deficiency}</h3>
                  <p className="mt-1 text-gray-700">{supplement.suggested_supplement}</p>
                  <p className="mt-2 text-amber-700 text-sm italic">⚠️ {supplement.caution}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comparative Insights */}
        {healthReport.comparative_insights && healthReport.comparative_insights.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Report</h2>
            <div className="space-y-4">
              {healthReport.comparative_insights.map(insight => (
                <div key={insight._id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800">{insight.test_name}</h3>
                  <div className="flex gap-x-6 mt-2">
                    <div>
                      <span className="text-sm text-gray-500">Previous:</span>
                      <p className="font-medium">{insight.previous_value}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Current:</span>
                      <p className="font-medium">{insight.current_value}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{insight.change_analysis}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Button onClick={() => window.print()}>Print Report</Button>
          <Button variant="outline" onClick={() => navigate('/upload-report')}>Upload New Report</Button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;