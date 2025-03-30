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

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/upload-report" element={<UploadReport />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </UserContextProvider>
  );
}

export default App;