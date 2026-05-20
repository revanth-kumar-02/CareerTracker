import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import logoWhite from '../../assets/logo-white.svg';

export default function LandingLayout() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background antialiased">
      {/* Top Nav */}
      <nav className="w-full h-16 flex justify-between items-center px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <img src={isDark ? logoWhite : logo} className="h-8 w-auto" alt="CareerTrack AI" />
        </div>
        <Link
          to="/auth"
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-[13px] font-semibold shadow-md hover:bg-primary/90 transition-all duration-200"
        >
          Get Started
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
