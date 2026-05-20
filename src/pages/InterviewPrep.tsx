import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import { getProfile } from '../utils/supabaseClient';
import { AVAILABLE_ROLES } from '../data/mockData';

interface PreviousSession {
  targetRole: string;
  interviewType: string;
  avgConfidence: number;
  starredSkills: string[];
  coachingTips: string[];
}

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [targetRole, setTargetRole] = useState('Senior Cloud Architect');
  const [interviewType, setInterviewType] = useState('Behavioral (STAR Framework)');
  const [prevSession, setPrevSession] = useState<PreviousSession | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfile();
        if (data) {
          if (data.target_role) {
            setTargetRole(data.target_role);
          }
          if (data.interview_session) {
            setPrevSession(data.interview_session);
          }
        }
      } catch (e) {
        console.error("Failed to load interview profile from Supabase:", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadData();
  }, []);

  const handleLaunchSimulator = () => {
    // Pass config through React Router location state rather than localStorage
    navigate('/interview/simulator', { state: { targetRole, interviewType } });
  };

  if (loadingProfile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing Interview Prep with Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-6">
        <div>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mb-1">AI Interview Prep</h1>
          <p className="text-body-lg text-on-surface-variant font-medium">
            Dynamic, real-time AI behavioral &amp; technical interview coach.
          </p>
        </div>
      </header>

      {/* Main Settings & History Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Setup Configurator (Left) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold">tune</span>
              Configure Simulator Session
            </h3>
            <p className="text-xs text-on-surface-variant">Set up the dynamic parameters for your AI technical/behavioral simulator.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Target Professional Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface focus:border-primary cursor-pointer outline-none"
              >
                {AVAILABLE_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Interview Vector Category</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface focus:border-primary cursor-pointer outline-none"
              >
                <option>Behavioral (STAR Framework)</option>
                <option>Systems Architecture &amp; Scale</option>
                <option>Technical Syntax &amp; Design Patterns</option>
                <option>Product Strategy &amp; Growth Metrics</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container-high flex justify-end">
            <button
              onClick={handleLaunchSimulator}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">rocket_launch</span>
              Launch Immersive Simulator
            </button>
          </div>
        </div>

        {/* History Scorecard (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {prevSession ? (
            <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-outline uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary">analytics</span>
                  Previous Session Scorecard
                </h3>
                <div className="flex items-center gap-6 mb-4">
                  <CircularProgress
                    value={prevSession.avgConfidence}
                    max={100}
                    size={100}
                    strokeWidth={8}
                    color="#6b38d4"
                    trackColor="#f1f5f9"
                  >
                    <span className="text-2xl font-black text-on-surface">{prevSession.avgConfidence}%</span>
                  </CircularProgress>
                  <div>
                    <h4 className="text-sm font-extrabold text-on-surface">{prevSession.targetRole}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{prevSession.interviewType}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-extrabold uppercase">
                      Completed Session
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-surface-container-high">
                  <p className="text-xs font-bold text-on-surface">Key AI Coaching Recommendations:</p>
                  <ul className="space-y-2">
                    {prevSession.coachingTips.slice(0, 2).map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
                        <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">tips_and_updates</span>
                        <span className="font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium flex flex-col justify-center items-center text-center p-8 flex-grow">
              <div className="w-14 h-14 bg-secondary/5 rounded-xl border border-secondary/20 flex items-center justify-center text-secondary mb-4 animate-pulse">
                <span className="material-symbols-outlined text-2xl fill">auto_awesome</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">No Interview History Yet</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mt-1.5 leading-relaxed font-medium">
                Launch the simulator above to conduct a live dynamic Q&amp;A session. The AI will score your answers and offer feedback.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
