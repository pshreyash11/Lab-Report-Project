import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import UserDashboard from "./pages/dashboard/userDashboard";
import UserContextProvider from "./context/UserContextProvider";
import UploadReport from "./pages/report/uploadReport";
import HealthInsights from "./pages/report/healthInsights";
import HealthTrends from "./pages/report/healthTrends";
import { ThemeProvider } from "./components/theme/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <UserContextProvider>
        <div className="w-full min-h-screen overflow-x-hidden">
          <Router>
            <Routes>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="/upload-report" element={<UploadReport />} />
              <Route path="/health-insights" element={<HealthInsights />} />
              <Route path="/health-trends" element={<HealthTrends />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </div>
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default App;
