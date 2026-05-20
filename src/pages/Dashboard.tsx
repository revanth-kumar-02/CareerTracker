import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import { companies, AVAILABLE_ROLES } from '../data/mockData';
import { useProfile } from '../context/ProfileContext';

export default function Dashboard() {
  const { profile, loading, updateProfile } = useProfile();

  // Onboarding form state
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || '');
      setEditRole(profile.target_role || '');
    }
  }, [profile]);

  const handleOnboardingSave = async () => {
    if (!editName.trim() || !editRole.trim()) return;

    setOnboardingLoading(true);
    try {
      await updateProfile({
        name: editName.trim(),
        target_role: editRole.trim(),
        briefing: `Dynamic intelligence briefing active for your path to become a ${editRole.trim()}. High-demand competencies like System Architecture are surging +34% in regional hubs.`
      });
    } catch (e) {
      console.error("Failed to save onboarding profile:", e);
    } finally {
      setOnboardingLoading(false);
    }
  };

  // Loading skeleton state
  if (loading && !profile) {
    return (
      <div className="space-y-10 animate-pulse pb-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-surface-container-highest">
          <div className="space-y-3 flex-1">
            <div className="w-32 h-4 bg-surface-container rounded-full"></div>
            <div className="w-64 h-10 bg-surface-container rounded-lg"></div>
            <div className="w-full max-w-md h-4 bg-surface-container rounded-full"></div>
          </div>
          <div className="flex gap-4 w-full md:w-auto shrink-0">
            <div className="w-36 h-16 bg-surface-container rounded-xl"></div>
            <div className="w-36 h-16 bg-surface-container rounded-xl"></div>
          </div>
        </header>
        <div className="w-full h-44 bg-surface-container rounded-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-48 bg-surface-container rounded-2xl"></div>
          <div className="lg:col-span-4 h-48 bg-surface-container rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Onboarding state if user is new or has no profile/name
  const isOnboarding = !profile || !profile.name || !profile.target_role;

  if (isOnboarding) {
    return (
      <div className="max-w-xl mx-auto my-12 animate-fade-in space-y-6">
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-8 shadow-premium space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container ai-glow">
              <span className="material-symbols-outlined fill text-2xl text-primary">psychology</span>
            </div>
            <h2 className="text-2xl font-extrabold text-on-surface text-gradient mt-4">Define Your Professional Vector</h2>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Configure your AI career engine path to initialize dynamic roadmaps, interview simulations, and market insights.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Target Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:border-primary outline-none transition-all cursor-pointer"
              >
                <option value="" disabled>Select a professional role...</option>
                {AVAILABLE_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleOnboardingSave}
            disabled={!editName.trim() || !editRole.trim() || onboardingLoading}
            className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">rocket_launch</span>
            {onboardingLoading ? 'Initializing Engine...' : 'Initialize AI Career Engine'}
          </button>
        </div>
      </div>
    );
  }

  // Parse roadmap progress
  let roadmapPercentage = 0;
  let roadmapSkills: { name: string; width: string; completed: boolean; inProgress: boolean }[] = [];

  if (profile.roadmap && profile.roadmap.stages) {
    try {
      let completed = 0;
      let total = 0;
      profile.roadmap.stages.forEach((stage: any) => {
        if (stage.status === 'Completed') completed += 1;
        total += 1;
        if (stage.subtasks) {
          stage.subtasks.forEach((sub: any) => {
            if (sub.status === 'Completed') completed += 1;
            total += 1;
          });
        }
      });
      roadmapPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      if (profile.roadmap.skillGaps) {
        roadmapSkills = profile.roadmap.skillGaps.map((gap: any, idx: number) => ({
          name: gap.name,
          width: gap.progressWidth === '3/5' ? '60%' : gap.progressWidth === '2/5' ? '40%' : gap.progressWidth === '4/5' ? '80%' : '100%',
          completed: idx === 2,
          inProgress: idx === 0
        }));
      }
    } catch (e) {
      console.error("Failed to parse roadmap progress:", e);
    }
  }

  // Parse resume ATS score
  const atsScore = profile.resume_analysis?.atsScore ?? null;

  // Parse interview preparedness index
  const interviewScore = profile.interview_session?.confidenceIndex 
    ? parseFloat((profile.interview_session.confidenceIndex / 10).toFixed(1))
    : null;

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Header Section with AI Pulse */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-surface-container-highest">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              Live AI Intelligence Feed
            </span>
          </div>

          <div className="group relative">
            <h1 className="text-3xl md:text-[44px] font-extrabold leading-tight tracking-tight text-on-surface mb-2 flex items-center gap-2">
              Welcome back, {profile.name}
              <Link
                to="/profile"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-all text-xs flex items-center gap-1 font-bold shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">settings</span>
                Edit Profile
              </Link>
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl">{profile.briefing}</p>
          </div>
        </div>


        {/* Global Stats Widget */}
        <div className="flex gap-4 w-full md:w-auto shrink-0">
          <div className="flex-1 md:flex-none px-4 py-3 bg-surface-container-lowest border border-surface-container rounded-xl shadow-premium flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined font-bold">trending_up</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Market Speed</p>
              <p className="text-base font-extrabold text-primary">Accelerating</p>
            </div>
          </div>
          <div className="flex-1 md:flex-none px-4 py-3 bg-surface-container-lowest border border-surface-container rounded-xl shadow-premium flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined font-bold">query_stats</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Hiring Index</p>
              <p className="text-base font-extrabold text-secondary">8.4 / 10</p>
            </div>
          </div>
        </div>
      </header>

      {/* Infinite Company Marquee Panel (Ecosystem Hub) */}
      <section className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold">domain</span>
              Dream Company Ecosystem
            </h3>
            <p className="text-xs text-on-surface-variant">Real-time pathway integrations across global and Indian tech giants</p>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-full shrink-0">
            33 Active Ecosystem Partners
          </span>
        </div>

        {/* Dual Marquees */}
        <div className="relative overflow-hidden marquee-container select-none -mx-6 pt-2">
          {/* Subtle edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex flex-col gap-4">
            {/* Top row - left moving */}
            <div className="flex overflow-hidden w-full">
              <div className="flex gap-3 animate-marquee-left whitespace-nowrap py-1">
                {[...companies.slice(0, 16), ...companies.slice(0, 16)].map((company, idx) => (
                  <div
                    key={`dash-c1-${company}-${idx}`}
                    className="px-5 py-3 rounded-xl border border-surface-container text-on-surface font-semibold text-xs cursor-pointer shrink-0 premium-glass"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row - right moving */}
            <div className="flex overflow-hidden w-full">
              <div className="flex gap-3 animate-marquee-right whitespace-nowrap py-1">
                {[...companies.slice(16), ...companies.slice(16)].map((company, idx) => (
                  <div
                    key={`dash-c2-${company}-${idx}`}
                    className="px-5 py-3 rounded-xl border border-surface-container text-on-surface font-semibold text-xs cursor-pointer shrink-0 premium-glass"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary/30"></span>
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Progress Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Career Roadmap Progress Card */}
        {profile.roadmap ? (
          <Link 
            to="/roadmap" 
            className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-premium hover:shadow-premium-hover transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 duration-700"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
                  Custom Roadmap
                </span>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {profile.target_role}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Calculated based on your background metrics</p>
              </div>
              <div className="text-3xl font-extrabold text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/20">
                {roadmapPercentage}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 relative z-10">
              {roadmapSkills.map((skill) => (
                <div 
                  key={skill.name} 
                  className={`p-3 bg-surface-container-low border border-surface-container rounded-xl transition-all duration-300 ${
                    skill.inProgress ? 'border-primary/40 bg-primary/5 shadow-sm' : 'hover:border-outline-variant/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[11px] font-bold truncate max-w-[120px] ${
                      skill.inProgress ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {skill.name}
                    </span>
                    {skill.completed ? (
                      <span className="material-symbols-outlined text-[14px] text-primary fill">check_circle</span>
                    ) : skill.inProgress ? (
                      <span className="material-symbols-outlined text-[14px] text-secondary fill animate-pulse">auto_awesome</span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant/40">lock</span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        skill.completed || skill.inProgress ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                      style={{ width: skill.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Link>
        ) : (
          <Link 
            to="/roadmap" 
            className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-surface-container shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 duration-700"></div>
            <div className="relative z-10 space-y-4">
              <div>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2 inline-block">
                  AI Journey Blueprint
                </span>
                <h3 className="text-xl font-extrabold text-on-surface group-hover:text-primary transition-colors">
                  Generate Your Custom Roadmap
                </h3>
                <p className="text-xs text-on-surface-variant max-w-md mt-1 leading-relaxed">
                  You have not generated an AI roadmap yet. Initialize a customized multi-stage roadmap for the target role: <span className="font-semibold text-primary">{profile.target_role}</span>.
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm transition-all group-hover:bg-primary/95 cursor-pointer">
                  <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
                  Build Custom Roadmap
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* AI Interview Prep Card */}
        <Link 
          to="/interview" 
          className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative mb-3">
            <CircularProgress
              value={interviewScore ?? 0}
              max={10}
              size={108}
              strokeWidth={7}
              color="#6b38d4"
              trackColor="#f1f5f9"
            >
              <span className="text-3xl font-extrabold text-on-surface">{interviewScore !== null ? interviewScore : "--"}</span>
            </CircularProgress>
            {interviewScore !== null && (
              <span className="material-symbols-outlined text-secondary absolute -top-1 -right-1 text-lg fill animate-bounce">auto_awesome</span>
            )}
          </div>
          
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            AI Assessment Index
          </span>
          <h4 className="text-sm font-extrabold text-on-surface mb-3">Interview Preparedness</h4>
          
          <span className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            {interviewScore !== null ? 'Resume Simulation' : 'Launch Simulator'}
          </span>
        </Link>
      </div>

      {/* Dynamic Hub Highlights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* ATS Resume Analyzer Card */}
        <Link 
          to="/resume"
          className="bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="space-y-2 relative z-10 flex-1 pr-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-base">description</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">ATS Agent</span>
            </div>
            <h4 className="text-base font-extrabold text-on-surface group-hover:text-primary transition-colors">Resume Lab Audit</h4>
            <p className="text-xs text-on-surface-variant">Optimize your credentials against hard hiring algorithms instantly.</p>
          </div>
          <div className="relative shrink-0 flex flex-col items-center justify-center border-l border-surface-container pl-6 min-w-[100px]">
            <span className="text-3xl font-black text-primary">{atsScore !== null ? atsScore : "--"}</span>
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">ATS SCORE</span>
          </div>
        </Link>

        {/* Market Category Explorer Card */}
        <Link 
          to="/discovery"
          className="bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
          <div className="space-y-2 relative z-10 flex-1 pr-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-base">explore</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Market Intel</span>
            </div>
            <h4 className="text-base font-extrabold text-on-surface group-hover:text-secondary transition-colors">Role Category Explorer</h4>
            <p className="text-xs text-on-surface-variant">Browse active tech tracks, demand coefficients, and salary percentiles.</p>
          </div>
          <div className="relative shrink-0 flex flex-col items-center justify-center border-l border-surface-container pl-6 min-w-[100px]">
            <span className="text-3xl font-black text-secondary">26</span>
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">ACTIVE PATHS</span>
          </div>
        </Link>
      </div>

    </div>
  );
}
