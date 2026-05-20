import React, { useState, useEffect } from 'react';
import { getProfile, upsertProfile, SupabaseProfile } from '../utils/supabaseClient';
import { AVAILABLE_ROLES } from '../data/mockData';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Forms state
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [briefing, setBriefing] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
      if (data) {
        setName(data.name || '');
        setTargetRole(data.target_role || AVAILABLE_ROLES[0]);
        setBriefing(data.briefing || '');
      }
    } catch (e) {
      console.error("Failed to load profile in settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      // Calculate dynamic briefing if not custom
      const finalBriefing = briefing.trim() || `Dynamic intelligence briefing active for your path to become a ${targetRole}. System components are primed.`;
      
      // Calculate achievements XP bonus if state has changed
      let extraXp = 0;
      if (profile) {
        // Simple mock calculations to reward actions
        let computedXp = 100; // Base onboarding XP
        if (profile.roadmap) computedXp += 200;
        if (profile.resume_analysis) computedXp += 100;
        if (profile.interview_session) computedXp += 150;
        
        extraXp = computedXp;
      }

      const updated = await upsertProfile({
        name: name.trim(),
        target_role: targetRole,
        briefing: finalBriefing,
        xp: extraXp > 0 ? extraXp : (profile?.xp || 100)
      });

      setProfile(updated);
      setSaveSuccess(true);
      
      // Dispatch custom event to notify Layout sidebar
      window.dispatchEvent(new Event('profile-updated'));

      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to update profile settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Loading Premium Account Engine...</p>
        </div>
      </div>
    );
  }

  // Calculate Achievement Completion
  const achievements = [
    {
      id: 'init',
      title: 'Vector Initiated',
      desc: 'Set up your target role and initialize career profile.',
      xp: 100,
      unlocked: !!profile?.name && !!profile?.target_role,
      icon: 'verified_user',
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'resume',
      title: 'ATS Audited',
      desc: 'Audited your current resume credentials in Resume Lab.',
      xp: 100,
      unlocked: !!profile?.resume_analysis,
      icon: 'description',
      color: 'text-secondary bg-secondary/10'
    },
    {
      id: 'roadmap',
      title: 'Blueprint Created',
      desc: 'Generated a dynamic, customizable AI Roadmap.',
      xp: 200,
      unlocked: !!profile?.roadmap,
      icon: 'route',
      color: 'text-tertiary bg-tertiary/10'
    },
    {
      id: 'interview',
      title: 'Simulator Graduate',
      desc: 'Completed an immersive mock interview simulation.',
      xp: 150,
      unlocked: !!profile?.interview_session,
      icon: 'record_voice_over',
      color: 'text-success bg-success/10'
    }
  ];

  const totalCalculatedXp = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-6">
        <div>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mb-1">Profile &amp; Settings</h1>
          <p className="text-body-lg text-on-surface-variant font-medium">
            Manage your AI career vector parameters, telemetries, and career achievement log.
          </p>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Settings (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <form onSubmit={handleSave} className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center pb-4 border-b border-surface-container-high">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                  Personal Career Vector
                </h3>
                <p className="text-xs text-on-surface-variant">Update the foundational details that seed your custom recommendations.</p>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                Supabase Sync
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3.5 bg-success/10 border border-success/30 rounded-xl text-xs font-bold text-success flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-sm font-bold animate-bounce">check_circle</span>
                Changes saved successfully! Your dashboard and recommendations are fully synced.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Target Job Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface focus:border-primary cursor-pointer outline-none transition-all"
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Daily Professional Briefing Setup
              </label>
              <textarea
                rows={4}
                placeholder="Brief summary of your current trajectory, goals, and target companies..."
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl p-4 text-xs font-semibold text-on-surface focus:border-primary outline-none transition-all resize-none leading-relaxed"
              />
              <p className="text-[10px] text-on-surface-variant font-medium">
                This context is appended directly to the AI briefing engine on your Main Dashboard.
              </p>
            </div>

            <div className="pt-4 border-t border-surface-container-high flex justify-end">
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-extrabold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm font-bold">save</span>
                {saving ? 'Syncing...' : 'Save Vector Details'}
              </button>
            </div>
          </form>

          {/* Gamified Achievements / XP Ledger */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">emoji_events</span>
                Career Achievements &amp; Gamified Milestone Log
              </h3>
              <p className="text-xs text-on-surface-variant">Complete key platform milestones to level up your career readiness telemetry.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {achievements.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border flex gap-3 transition-all ${
                    item.unlocked 
                      ? 'bg-surface-container-low border-success/20 shadow-sm' 
                      : 'bg-surface-container-lowest/40 border-outline-variant/20 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.unlocked ? 'bg-success/10 text-success' : 'bg-surface-container text-on-surface-variant/40'
                  }`}>
                    <span className="material-symbols-outlined text-lg font-bold">
                      {item.unlocked ? 'emoji_events' : item.icon}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-on-surface">{item.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                        item.unlocked ? 'bg-success/10 text-success' : 'bg-surface-container text-on-surface-variant/40'
                      }`}>
                        +{item.xp} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Bento Metrics (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* XP Level Status Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary font-bold">military_tech</span>
                Account Growth Telemetry
              </h3>
              <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                Level {Math.max(1, Math.floor(totalCalculatedXp / 150))} Professional
              </span>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-on-surface tracking-tight">
                  {totalCalculatedXp}
                </span>
                <span className="text-xs font-extrabold text-on-surface-variant pb-1">XP EARNED</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed">
                Complete actions like auditing resumes and designing roadmaps to earn level-ups.
              </p>
            </div>
            
            <div className="space-y-1.5 pt-4 border-t border-surface-container-high">
              <div className="flex justify-between text-[9px] font-extrabold text-on-surface-variant">
                <span>NEXT LEVEL</span>
                <span>{totalCalculatedXp} / {Math.max(1, Math.ceil(totalCalculatedXp / 150)) * 150} XP</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-1000"
                  style={{ width: `${(totalCalculatedXp % 150) / 1.5 || 2}%` }}
                />
              </div>
            </div>
          </div>

          {/* Activity Streak Chart */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary font-bold">local_fire_department</span>
              Streak Analytics Telemetry
            </h3>

            <div className="flex justify-around items-end h-28 gap-2 bg-surface-container-low border border-surface-container/50 rounded-xl p-3 mb-4">
              {[35, 50, 75, 40, 85, 60, 95].map((val, idx) => {
                const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                const isToday = idx === 6;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end gap-1.5">
                    <div 
                      className={`w-full rounded-sm transition-all duration-500 ${
                        isToday 
                          ? 'bg-secondary shadow-[0_0_10px_rgba(107,56,212,0.3)]' 
                          : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                      style={{ height: `${val}%` }}
                      title={`Activity Score: ${val}`}
                    />
                    <span className="text-[9px] font-extrabold text-on-surface-variant select-none">
                      {dayLabels[idx]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <h4 className="text-[11px] font-extrabold text-on-surface leading-none">
                    {profile?.streak || 0}-Day Streak
                  </h4>
                  <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Active Study streak</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-extrabold text-on-surface leading-none">
                  {profile?.streak && profile.streak > 14 ? profile.streak : 14}-Day
                </p>
                <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">Best Streak</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
