import { LayoutDashboard, Compass, FileText, Mic, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }: { activeView: string, setActiveView: (view: string) => void }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'discovery', name: 'Discovery', icon: Compass },
    { id: 'resume', name: 'Resume Lab', icon: FileText },
    { id: 'interview', name: 'Interview Prep', icon: Mic },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full p-4 gap-2 bg-surface-container-low/80 rounded-xl w-64 shadow-sm">
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <span className="font-bold">CT</span>
        </div>
        <div>
          <h1 className="font-bold text-lg text-on-surface leading-tight">CareerTrack</h1>
          <p className="text-xs text-outline">AI Intelligence</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === item.id 
              ? 'bg-primary text-white' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-4 border-t border-outline-variant/30">
        <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold text-sm shadow-md">
          Upgrade to Pro
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm">
          <HelpCircle className="w-4 h-4" /> Support
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
