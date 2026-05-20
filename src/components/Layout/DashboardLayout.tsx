import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { supabase } from '../../utils/supabaseClient';
import SupportOverlay from '../ui/SupportOverlay';
import logo from '../../assets/logo.svg';
import logoWhite from '../../assets/logo-white.svg';
import icon from '../../assets/icon.svg';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/discovery', icon: 'explore', label: 'Discovery' },
  { to: '/roadmap', icon: 'route', label: 'Career Journey' },
  { to: '/resume', icon: 'description', label: 'Resume Lab' },
  { to: '/interview', icon: 'record_voice_over', label: 'Interview Prep' },
  { to: '/profile', icon: 'settings', label: 'Settings' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const [supportOpen, setSupportOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error("Failed to sign out from Supabase session:", err);
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    if (path === '/roadmap') {
      return location.pathname.startsWith('/roadmap');
    }
    if (path === '/discovery') {
      return location.pathname === '/discovery';
    }
    if (path === '/resume') {
      return location.pathname.startsWith('/resume');
    }
    if (path === '/interview') {
      return location.pathname.startsWith('/interview');
    }
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    return location.pathname === path;
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center p-3 animate-pulse mx-auto shadow-sm">
            <img src={icon} className="w-full h-full object-contain animate-spin-slow" style={{ animationDuration: '6s' }} alt="Loading..." />
          </div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing AI Career Vector...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:block antialiased relative">
      {/* Mobile Top Nav */}
      <nav className="md:hidden w-full h-16 bg-surface/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-3">
          <img src={isDark ? logoWhite : logo} className="h-8 w-auto" alt="CareerTrack AI" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface-container flex items-center justify-center text-xs font-bold text-primary">
            {profile?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-[calc(100vh-2rem)] p-6 gap-2 bg-surface-container-lowest fixed left-4 top-4 bottom-4 w-64 rounded-xl shadow-sm z-40 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center ai-glow p-1 bg-surface-container-low">
            <img src={icon} className="w-full h-full object-contain" alt="CareerTrack AI" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-on-surface leading-tight font-display tracking-tight">
              CareerTrack<span className="text-primary font-black">AI</span>
            </h1>
            <p className="text-[10px] font-bold text-secondary tracking-widest uppercase">Intelligence</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={() =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`
              }
            >
              <span className={`material-symbols-outlined ${isActive(item.to) ? 'fill' : ''}`}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1 pt-2 border-t border-surface-container-highest">
            <button
              onClick={() => setSupportOpen(true)}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-[13px] font-medium hover:text-primary transition-all duration-200 w-full text-left cursor-pointer"
            >
              <span className="material-symbols-outlined">help</span>
              Support
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-error-container hover:text-error rounded-lg text-[13px] font-medium transition-all duration-200 w-full text-left cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 md:pt-8 px-4 md:pl-[320px] md:pr-12 lg:pl-[352px] lg:pr-20 pb-28 md:pb-12 max-w-[1400px]">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-t border-surface-container-highest h-16 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={() =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive(item.to) ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive(item.to) ? 'fill' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Support Overlay */}
      <SupportOverlay isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}

