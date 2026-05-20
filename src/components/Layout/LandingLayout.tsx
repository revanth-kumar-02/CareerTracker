import { Link, Outlet } from 'react-router-dom';

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background antialiased">
      {/* Top Nav */}
      <nav className="w-full h-16 flex justify-between items-center px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">trending_up</span>
          <span className="text-xl font-bold text-gradient">CareerTrack</span>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-[13px] font-semibold shadow-md hover:bg-primary/90 transition-all duration-200"
        >
          Get Started
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
