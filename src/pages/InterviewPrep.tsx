import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import { useProfile } from '../context/ProfileContext';
import { AVAILABLE_ROLES } from '../data/staticContent';

interface PreviousSession {
  targetRole: string;
  interviewType: string;
  avgConfidence: number;
  starredSkills: string[];
  coachingTips: string[];
}

export default function InterviewPrep() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const [targetRole, setTargetRole] = useState('Senior Cloud Architect');
  const [interviewType, setInterviewType] = useState('Behavioral (STAR Framework)');
  const [prevSession, setPrevSession] = useState<PreviousSession | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.target_role) {
        setTargetRole(profile.target_role);
      }
      if (profile.interview_session && typeof profile.interview_session.avgConfidence === 'number') {
        setPrevSession(profile.interview_session);
      } else {
        setPrevSession(null);
      }
    }
  }, [profile]);

  const handleLaunchSimulator = () => {
    navigate('/interview/simulator', { state: { targetRole, interviewType } });
  };

  // Dynamic contextual helpers to make the UI feel intentional
  const getFocusAreas = (type: string) => {
    if (type.includes('Behavioral')) return ['Leadership & Impact', 'Conflict Resolution', 'STAR Methodology'];
    if (type.includes('Architecture')) return ['System Scalability', 'Trade-off Analysis', 'Performance Limits'];
    if (type.includes('Syntax')) return ['Code Quality & Optimization', 'Algorithms', 'Language specific patterns'];
    return ['Product Vision', 'Go-to-Market Strategy', 'User Metrics'];
  };

  const focusAreas = getFocusAreas(interviewType);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing Interview Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20 max-w-6xl mx-auto font-sans">
      
      {/* Immersive Header */}
      <header className="mb-10 text-center space-y-3 pt-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/10 shadow-sm">
          <span className="material-symbols-outlined text-3xl text-primary fill">record_voice_over</span>
        </div>
        <h1 className="text-4xl font-black text-on-surface tracking-tight">AI Coaching Studio</h1>
        <p className="text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Prepare for your next role with a hyper-realistic, dynamic AI interviewer that adapts to your responses and grades your performance in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Configurator - Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Configuration Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-8 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-lg font-black text-on-surface flex items-center gap-2 mb-1">
                  Session Parameters
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">Customize the focus of your upcoming simulation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Target Professional Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer outline-none transition-all shadow-sm"
                  >
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Interview Vector</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer outline-none transition-all shadow-sm"
                  >
                    <option>Behavioral (STAR Framework)</option>
                    <option>Systems Architecture &amp; Scale</option>
                    <option>Technical Syntax &amp; Design Patterns</option>
                    <option>Product Strategy &amp; Growth Metrics</option>
                  </select>
                </div>
              </div>
              
              {/* Contextual Info (Replaces dead whitespace) */}
              <div className="pt-6 border-t border-surface-container-high grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-outline uppercase tracking-wider">Format</p>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">forum</span> Conversational
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-outline uppercase tracking-wider">Duration</p>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">timer</span> ~15 Mins
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-outline uppercase tracking-wider">Difficulty</p>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">tune</span> Adaptive AI
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-outline uppercase tracking-wider">Questions</p>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">format_list_numbered</span> 5 Prompts
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Launch Anchor Card */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-premium">
            <div className="space-y-3 flex-1 w-full">
              <h4 className="text-sm font-black text-on-surface">Target Competencies:</h4>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-primary/10 rounded-lg text-[10px] font-extrabold text-primary shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    {area}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleLaunchSimulator}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/95 transition-all duration-300 flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">rocket_launch</span>
              Start Simulation
            </button>
          </div>

        </div>

        {/* History Scorecard - Right Column */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-premium">
            <h3 className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">analytics</span>
              Historical Baseline
            </h3>
            
            {prevSession ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-3 pb-6 border-b border-surface-container-high">
                  <CircularProgress
                    value={prevSession.avgConfidence}
                    max={100}
                    size={120}
                    strokeWidth={8}
                    color="#6b38d4"
                    trackColor="#f1f5f9"
                  >
                    <span className="text-3xl font-black text-on-surface">{prevSession.avgConfidence}%</span>
                  </CircularProgress>
                  <p className="text-[10px] font-extrabold text-outline uppercase tracking-wider">Avg. Confidence Index</p>
                </div>
                
                <div className="space-y-2 text-center">
                  <h4 className="text-sm font-bold text-on-surface">{prevSession.targetRole}</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium">{prevSession.interviewType}</p>
                </div>

                <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-2xl space-y-3">
                  <p className="text-[10px] font-extrabold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px]">tips_and_updates</span>
                    Coach's Feedback
                  </p>
                  <ul className="space-y-2">
                    {(prevSession.coachingTips || []).slice(0, 2).map((tip, i) => (
                      <li key={i} className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                        "{tip}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 opacity-70">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-outline mb-4">
                  <span className="material-symbols-outlined text-3xl">history</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-2">No Prior Sessions</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Complete your first simulation to establish your baseline confidence index.
                </p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
