import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import LandingLayout from './components/Layout/LandingLayout';
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ResumeLab from './pages/ResumeLab';
import ResumeFeedback from './pages/ResumeFeedback';
import MarketInsights from './pages/MarketInsights';
import InterviewPrep from './pages/InterviewPrep';
import InterviewSimulator from './pages/InterviewSimulator';
import CareerRoadmap from './pages/CareerRoadmap';
import RoadmapGenerator from './pages/RoadmapGenerator';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <ErrorBoundary>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (Landing Layout) */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Landing />} />
            </Route>

            {/* Member/Dashboard Routes (Dashboard Layout) */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discovery" element={<MarketInsights />} />
              <Route path="/roadmap" element={<CareerRoadmap />} />
              <Route path="/roadmap/generator" element={<RoadmapGenerator />} />
              <Route path="/resume" element={<ResumeLab />} />
              <Route path="/resume/feedback" element={<ResumeFeedback />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/interview/simulator" element={<InterviewSimulator />} />
              <Route path="/profile" element={<ProfileSettings />} />
            </Route>

            {/* Catch-all fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </ErrorBoundary>
  );
}
