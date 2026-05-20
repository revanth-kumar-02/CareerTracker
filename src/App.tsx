import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import LandingLayout from './components/Layout/LandingLayout';
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResumeLab from './pages/ResumeLab';
import ResumeFeedback from './pages/ResumeFeedback';
import MarketInsights from './pages/MarketInsights';
import InterviewPrep from './pages/InterviewPrep';
import InterviewSimulator from './pages/InterviewSimulator';
import CareerRoadmap from './pages/CareerRoadmap';
import RoadmapGenerator from './pages/RoadmapGenerator';
import ProfileSettings from './pages/ProfileSettings';

// ── Protected Route guard ─────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-xs text-on-surface-variant font-bold tracking-wide">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// ── Inner app (needs AuthProvider in context) ─────────────────────────────
function AppRoutes() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth Route — standalone, no layout wrapper */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
