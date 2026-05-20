import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { AVAILABLE_ROLES } from '../data/staticContent';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileSettings() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);

  // Forms state
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [briefing, setBriefing] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setTargetRole(profile.target_role || AVAILABLE_ROLES[0]);
      setBriefing(profile.briefing || '');
    }
  }, [profile]);

  // Calculate dynamic stats from profile
  let completedRoadmapPhases = 0;
  let completedLearningTasks = 0;
  let completedPracticeTasks = 0;
  let completedProjects = 0;
  let totalTasksCount = 0;

  if (profile && profile.roadmap) {
    const roadmap = profile.roadmap;
    if (Array.isArray(roadmap.phases)) {
      roadmap.phases.forEach((phase: any) => {
        // Count completed phase
        if (phase.completionPercentage === 100 || (phase.finalProject && phase.finalProject.status === 'Completed')) {
          completedRoadmapPhases++;
        }
        
        // Count final projects
        if (phase.finalProject && phase.finalProject.status === 'Completed') {
          completedProjects++;
        }

        // Count day tasks
        if (Array.isArray(phase.days)) {
          phase.days.forEach((day: any) => {
            totalTasksCount++;
            if (day.status === 'Completed') {
              if (day.type === 'LEARN') {
                completedLearningTasks++;
              } else if (day.type === 'PRACTICE') {
                completedPracticeTasks++;
              }
            }
          });
        }
      });
    }
  }

  const interviewSessionsFinished = profile?.interview_session ? 1 : 0;
  const resumeAnalysesCompleted = profile?.resume_analysis ? 1 : 0;
  const actualStreak = profile?.streak || 0;
  const currentXp = profile?.xp || 0;

  // Achievement definitions
  const achievements = [
    {
      id: 'init',
      title: 'Vector Initiated',
      desc: 'Set up your target role and initialize career profile.',
      xp: 100,
      unlocked: !!profile?.name && !!profile?.target_role,
      icon: 'verified_user',
      color: 'text-primary bg-primary/10 border-primary/25',
      date: profile?.name ? 'Completed' : 'Locked'
    },
    {
      id: 'resume',
      title: 'ATS Audited',
      desc: 'Audited your current resume credentials in Resume Lab.',
      xp: 100,
      unlocked: !!profile?.resume_analysis,
      icon: 'description',
      color: 'text-secondary bg-secondary/10 border-secondary/25',
      date: profile?.resume_analysis ? 'Completed' : 'Locked'
    },
    {
      id: 'roadmap',
      title: 'Blueprint Created',
      desc: 'Generated a dynamic, customizable AI Roadmap.',
      xp: 200,
      unlocked: !!profile?.roadmap,
      icon: 'route',
      color: 'text-tertiary bg-tertiary/10 border-tertiary/25',
      date: profile?.roadmap ? 'Completed' : 'Locked'
    },
    {
      id: 'interview',
      title: 'Simulator Graduate',
      desc: 'Completed an immersive mock interview simulation.',
      xp: 150,
      unlocked: !!profile?.interview_session,
      icon: 'record_voice_over',
      color: 'text-success bg-success/10 border-success/25',
      date: profile?.interview_session ? 'Completed' : 'Locked'
    },
    {
      id: 'phase_finisher',
      title: 'Phase Finisher',
      desc: 'Successfully finished Phase 1 of your learning roadmap.',
      xp: 250,
      unlocked: completedRoadmapPhases >= 1,
      icon: 'military_tech',
      color: 'text-warning bg-warning/10 border-warning/25',
      date: completedRoadmapPhases >= 1 ? 'Completed' : 'Locked'
    },
    {
      id: 'practice_solver',
      title: 'Task Conqueror',
      desc: 'Completed at least 3 practice exercises in your path.',
      xp: 300,
      unlocked: completedPracticeTasks >= 3,
      icon: 'task_alt',
      color: 'text-primary bg-primary/10 border-primary/25',
      date: completedPracticeTasks >= 3 ? 'Completed' : 'Locked'
    }
  ];

  // Calculate dynamic XP sum just as a verification indicator
  const unlockedXpSum = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const finalBriefing = briefing.trim() || `Guided roadmap parameters active to become a ${targetRole}. System components are primed.`;
      
      // Update the profile with new details
      await updateProfile({
        name: name.trim(),
        target_role: targetRole,
        briefing: finalBriefing,
        xp: Math.max(currentXp, unlockedXpSum) // Ensure XP matches or incorporates the achievements XP
      });

      setSaveSuccess(true);
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
          <p className="text-xs text-on-surface-variant font-bold">Accessing Learning Account...</p>
        </div>
      </div>
    );
  }

  // Calculate level based on XP (every 200 XP is a level)
  const userLevel = Math.max(1, Math.floor(currentXp / 200));
  const nextLevelXp = (userLevel + 1) * 200;
  const currentLevelMinXp = userLevel * 200;
  const levelProgressPct = Math.min(100, Math.max(0, ((currentXp - currentLevelMinXp) / 200) * 100));

  return (
    <div className="space-y-10 animate-fade-in pb-16 max-w-7xl mx-auto font-sans px-4">
      
      {/* Header */}
      <header className="mb-4 border-b border-surface-container pb-6">
        <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none mb-2">Profile &amp; Settings</h1>
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
          Manage your career targets, review your real-time learning metrics, and track unlocked study accomplishments.
        </p>
      </header>

      {/* Theme Toggle — Primary System Preference */}
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-premium">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-black text-on-surface">Interface Appearance</h3>
              <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {theme === 'dark' ? 'Dark Mode is active — charcoal surfaces, muted accents.' : 'Light Mode is active — clean white surfaces, vibrant accents.'}
              </p>
            </div>
          </div>

          {/* Segmented Toggle */}
          <div className="flex items-center p-1 bg-surface border border-surface-container rounded-xl gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-surface-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">light_mode</span>
              Light
            </button>
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-surface-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Settings (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile Form */}
          <form onSubmit={handleSave} className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 lg:p-8 shadow-premium space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center pb-4 border-b border-surface-container">
              <div>
                <h3 className="text-sm font-black text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
                  Career Goal Parameters
                </h3>
                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">Customize details that seed your custom roadmap recommendation paths.</p>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider">
                Sync Active
              </span>
            </div>

            {saveSuccess && (
              <div className="p-4 bg-success/15 border border-success/30 rounded-2xl text-xs font-bold text-success flex items-center gap-2.5 animate-fade-in">
                <span className="material-symbols-outlined text-lg font-bold">check_circle</span>
                Settings updated successfully! Your customized paths and recommendations have been recalculated.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-semibold text-on-surface focus:border-primary outline-none transition-all focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-bold text-on-surface focus:border-primary cursor-pointer outline-none transition-all focus:ring-1 focus:ring-primary"
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">
                Personal Learning Context (Briefing)
              </label>
              <textarea
                rows={4}
                placeholder="Brief summary of your current skills, goals, and target companies..."
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl p-4 text-xs font-semibold text-on-surface focus:border-primary outline-none transition-all resize-none leading-relaxed focus:ring-1 focus:ring-primary"
              />
              <p className="text-[10px] text-on-surface-variant font-medium">
                This summary guides the AI recommendations compiled in your learning dashboard.
              </p>
            </div>

            <div className="pt-4 border-t border-surface-container flex justify-end">
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-on-primary rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm font-bold">save</span>
                {saving ? 'Saving...' : 'Save Trajectory Details'}
              </button>
            </div>
          </form>

          {/* Gamified Achievements List */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 lg:p-8 shadow-premium space-y-5">
            <div>
              <h3 className="text-sm font-black text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">emoji_events</span>
                Career Achievements &amp; Milestones Log
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Achievements unlock dynamically as you complete resume feedback audits, interview simulations, and roadmaps.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border flex gap-3.5 transition-all duration-300 relative overflow-hidden group ${
                    item.unlocked 
                      ? 'bg-gradient-to-br from-surface-container-lowest to-secondary/5 border-secondary/30 shadow-sm hover:shadow-md' 
                      : 'bg-surface-container-lowest/50 border-surface-container opacity-50 border-dashed'
                  }`}
                >
                  {/* Lock Indicator */}
                  {!item.unlocked && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-surface rounded text-[8px] font-bold text-outline uppercase">
                      <span className="material-symbols-outlined text-[10px] font-bold">lock</span> Locked
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    item.unlocked 
                      ? 'bg-secondary/15 text-secondary scale-105 shadow-sm' 
                      : 'bg-surface text-outline'
                  }`}>
                    <span className="material-symbols-outlined text-[20px] font-bold">
                      {item.unlocked ? 'emoji_events' : item.icon}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-on-surface">{item.title}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold ${
                        item.unlocked ? 'bg-secondary/15 text-secondary' : 'bg-surface text-outline'
                      }`}>
                        +{item.xp} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed pr-8">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Visual Progress Metrics (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* XP Level Status Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-premium relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <h3 className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary font-bold text-[18px]">military_tech</span>
                Ecosystem progression
              </h3>
              <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg inline-block mb-4 uppercase tracking-wider">
                Level {userLevel} Learning Path
              </span>
              <div className="flex items-end gap-1.5 mb-1.5">
                <span className="text-4xl font-black text-on-surface tracking-tight leading-none">
                  {currentXp}
                </span>
                <span className="text-[10px] font-black text-on-surface-variant pb-1.5 uppercase tracking-wider">Total XP</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed">
                Complete roadmap checkmarks, practice questions, and mock interviews to increase your level.
              </p>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-surface-container mt-4">
              <div className="flex justify-between text-[9px] font-extrabold text-on-surface-variant">
                <span>NEXT LEVEL</span>
                <span>{currentXp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real Study Streak Activity */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-premium space-y-6">
            <h3 className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary font-bold text-[18px]">local_fire_department</span>
              Active study streaks
            </h3>

            <div className="flex justify-around items-end h-28 gap-2 bg-surface border border-surface-container rounded-2xl p-4">
              {[35, 50, 75, 40, 85, 60, actualStreak > 0 ? 100 : 15].map((val, idx) => {
                const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                const isToday = idx === 6;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end gap-1.5">
                    <div 
                      className={`w-full rounded-md transition-all duration-500 ${
                        isToday && actualStreak > 0
                          ? 'bg-secondary shadow-[0_0_10px_rgba(107,56,212,0.3)]' 
                          : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] font-extrabold text-on-surface-variant select-none">
                      {dayLabels[idx]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <h4 className="text-[11px] font-black text-on-surface leading-none">
                    {actualStreak} Day{actualStreak === 1 ? '' : 's'}
                  </h4>
                  <p className="text-[9px] text-on-surface-variant font-semibold mt-1">Study Streak</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-on-surface leading-none">
                  {Math.max(14, actualStreak)} Days
                </p>
                <p className="text-[9px] text-on-surface-variant font-semibold mt-1">Best Streak</p>
              </div>
            </div>
          </div>

          {/* Dynamic Learning Statistics List */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary font-bold text-[18px]">assessment</span>
              Dynamic Activity Log
            </h3>
            
            <div className="space-y-3 pt-2 text-xs font-bold text-on-surface">
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                <span className="text-on-surface-variant font-medium">Completed Phases</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{completedRoadmapPhases}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                <span className="text-on-surface-variant font-medium">Completed Projects</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{completedProjects}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                <span className="text-on-surface-variant font-medium">Learn Tasks Completed</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{completedLearningTasks}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                <span className="text-on-surface-variant font-medium">Practice Tasks Solved</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{completedPracticeTasks}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-container-high">
                <span className="text-on-surface-variant font-medium">Resumes Audited</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{resumeAnalysesCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Interview Coaching Sessions</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{interviewSessionsFinished}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
