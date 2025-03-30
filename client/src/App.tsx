import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/auth/login'
import SignupPage from './pages/auth/signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App