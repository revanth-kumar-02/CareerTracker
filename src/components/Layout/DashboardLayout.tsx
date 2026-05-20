import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/discovery', icon: 'explore', label: 'Discovery' },
  { to: '/resume', icon: 'description', label: 'Resume Lab' },
  { to: '/interview', icon: 'record_voice_over', label: 'Interview Prep' },
];

export default function DashboardLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/discovery') {
      return location.pathname === '/discovery' || location.pathname.startsWith('/roadmap');
    }
    if (path === '/resume') {
      return location.pathname.startsWith('/resume');
    }
    if (path === '/interview') {
      return location.pathname.startsWith('/interview');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row antialiased">
      {/* Mobile Top Nav */}
      <nav className="md:hidden w-full h-16 bg-surface/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gradient">CareerTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-surface-container">
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
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-lg text-[13px] font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
            Upgrade to Pro
          </button>
          <div className="flex flex-col gap-1 pt-3 border-t border-surface-container-highest">
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
      <main className="flex-1 md:ml-[280px] pt-20 md:pt-8 px-4 md:px-12 lg:px-20 pb-12 max-w-[1400px]">
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
