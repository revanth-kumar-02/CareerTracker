import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getProfile, SupabaseProfile } from '../../utils/supabaseClient';

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
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile in layout:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for custom events to refresh layout state dynamically
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:block antialiased relative">
      {/* Mobile Top Nav */}
      <nav className="md:hidden w-full h-16 bg-surface/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gradient">CareerTrack</span>
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
            A
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-[calc(100vh-2rem)] p-6 gap-2 bg-surface-container-lowest fixed left-4 top-4 bottom-4 w-64 rounded-xl shadow-sm z-40 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container ai-glow">
            <span className="material-symbols-outlined fill">psychology</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-on-surface leading-tight text-gradient">CareerTrack</h1>
            <p className="text-[11px] font-semibold text-secondary tracking-widest uppercase">AI Intelligence</p>
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
          {/* AI Career Streak & Recommendation Widget */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-secondary/10 transition-colors duration-500"></div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary font-bold text-[18px] fill animate-pulse">auto_awesome</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">AI Recommendation</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Hot</span>
            </div>

            <h4 className="text-xs font-bold text-on-surface mb-1">Growth Catalyst</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
              AI predicts a <span className="font-semibold text-primary">28% surge</span> in <span className="font-semibold text-primary">{profile?.target_role || 'Cloud + AI orchestration'}</span> roles this upcoming hiring cycle.
            </p>

            <div className="pt-3 border-t border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🔥</span>
                <div>
                  <p className="text-[11px] font-extrabold text-on-surface leading-none">{profile?.streak || 0}-Day Streak</p>
                  <p className="text-[8px] text-on-surface-variant font-medium mt-0.5">
                    {profile?.streak && profile.streak > 0 ? 'Top 5% Student' : 'Start your streak!'}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isCompleted = profile?.streak ? day <= profile.streak : false;
                  return (
                    <div 
                      key={day} 
                      className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-primary' : 'bg-primary/20 animate-pulse'}`}
                      title={isCompleted ? 'Completed' : 'Upcoming'}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-surface-container-highest">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-[13px] font-medium hover:text-primary transition-all duration-200">
              <span className="material-symbols-outlined">help</span>
              Support
            </a>
            <a href="/" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-error-container hover:text-error rounded-lg text-[13px] font-medium transition-all duration-200">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </a>
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
    </div>
  );
}
