import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { 
  BeakerIcon, 
  FlaskConicalIcon, 
  MicroscopeIcon, 
  LineChartIcon, 
  FileUpIcon, 
  SparklesIcon, 
  LogOutIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      <div className="absolute inset-0 flex items-center justify-center w-screen min-h-screen bg-background">
        <div className="p-8 bg-card rounded-lg shadow-md border border-border/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <BeakerIcon className="w-6 h-6 text-primary animate-pulse" />
            <p className="text-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-screen min-h-screen bg-background overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>
        <div className="absolute top-[50%] -right-[300px] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl animate-pulse" style={{ animationDuration: '25s' }}></div>
        <div className="absolute -bottom-[300px] left-[40%] w-[600px] h-[600px] rounded-full bg-green-500/5 blur-3xl animate-pulse" style={{ animationDuration: '30s' }}></div>
      </div>

      <header className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border/50 z-10 w-full">
        <div className="w-full mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FlaskConicalIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                ReportLab Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  userContext.setIsLoggedIn(false);
                  userContext.setUser(null);
                  navigate("/auth/login");
                }}
                className="flex items-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/80 backdrop-blur-sm rounded-lg shadow-md border border-border/50 p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <span className="bg-primary/10 p-2 rounded-full mr-3">
              👋
            </span>
            Hello, {userContext.user.fullname}!
          </h2>
          <p className="text-muted-foreground">
            Welcome to your health dashboard. Here you can manage your lab
            reports and track your health metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            <div className="h-full bg-card/80 backdrop-blur-sm rounded-lg shadow-md border border-border/50 p-6 transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-blue-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <FileUpIcon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Upload Report
                </h3>
                <p className="text-muted-foreground mb-4 h-12">
                  Upload your lab reports for AI-powered analysis
                </p>
                <Button
                  onClick={() => navigate("/upload-report")}
                  className="w-full justify-center group-hover:bg-blue-600"
                >
                  Upload Report
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group"
          >
            <div className="h-full bg-card/80 backdrop-blur-sm rounded-lg shadow-md border border-border/50 p-6 transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-green-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <LineChartIcon className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  View Health Trends
                </h3>
                <p className="text-muted-foreground mb-4 h-12">
                  Track changes in your lab results over time
                </p>
                <Button
                  onClick={() => navigate("/health-trends")}
                  className="w-full justify-center group-hover:bg-green-600"
                  variant="secondary"
                >
                  View Trends
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group"
          >
            <div className="h-full bg-card/80 backdrop-blur-sm rounded-lg shadow-md border border-border/50 p-6 transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-purple-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <SparklesIcon className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Health Insights
                </h3>
                <p className="text-muted-foreground mb-4 h-12">
                  Get AI-powered health recommendations and insights
                </p>
                <Button
                  onClick={() => navigate("/health-insights")}
                  className="w-full justify-center group-hover:bg-purple-600"
                  variant="outline"
                >
                  Get Insights
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center">
          <MicroscopeIcon size={14} className="mr-1" />
          <span>ReportLab — Advanced Lab Report Analytics</span>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
