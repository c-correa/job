import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompanyDashboard from './pages/CompanyDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoderDashboard from './pages/CoderDashboard';
import ApplicationTracking from './pages/ApplicationTracking';
import ProfileSettings from './pages/ProfileSettings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/dashboard-coder" element={<CoderDashboard />} />
        <Route path="/my-applications" element={<ApplicationTracking />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
