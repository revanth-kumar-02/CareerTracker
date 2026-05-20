import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume, DynamicResumeFeedback } from '../utils/aiService';
import { getProfile, saveResumeAnalysis, upsertProfile, SupabaseProfile } from '../utils/supabaseClient';
import { AVAILABLE_ROLES } from '../data/mockData';

export default function ResumeLab() {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadState, setUploadState] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Cloud Architect');
  const [analysis, setAnalysis] = useState<DynamicResumeFeedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const data = await getProfile();
        setProfile(data);
        if (data) {
          if (data.target_role) {
            setTargetRole(data.target_role);
          }
          if (data.resume_analysis) {
            setAnalysis(data.resume_analysis);
            setUploadState('results');
          }
        }
      } catch (e) {
        console.error("Failed to load profile in Resume Lab:", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfileData();
  }, []);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setUploadState('scanning');
    try {
      const data = await analyzeResume(resumeText, targetRole);
      setAnalysis(data);
      
      // Save directly to Supabase
      await saveResumeAnalysis(data);
      
      // Keep target role in sync
      const updatedProfile = await upsertProfile({
        target_role: targetRole
      });
      setProfile(updatedProfile);
      
      setUploadState('results');
      
      // Dispatch custom event to notify Sidebar/Layout
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      console.error(err);
      setUploadState('idle');
    }
  };

  const handleReset = async () => {
    setResumeText('');
    setAnalysis(null);
    setUploadState('idle');
    try {
      await saveResumeAnalysis(null);
      // Dispatch custom event to notify Sidebar/Layout
      window.dispatchEvent(new Event('profile-updated'));
    } catch (e) {
      console.error("Failed to reset analysis in Supabase:", e);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing Resume Lab with Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <header className="mb-8 flex justify-between items-start md:items-center gap-4 flex-wrap">
        <div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface mb-2">Resume Lab</h1>
          <p className="text-body-lg text-on-surface-variant font-medium">Optimize your CV against advanced ATS models and hiring algorithms.</p>
        </div>
        {uploadState === 'results' && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Reset &amp; Audit New CV
          </button>
        )}
      </header>

      {uploadState === 'idle' && (
        <form onSubmit={handleStartAnalysis} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editor/Paste Area */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-4">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h4 className="text-sm font-bold text-on-surface">Paste Resume Content</h4>
                <p className="text-xs text-on-surface-variant">Paste your current resume details below (experience, education, skills, projects).</p>
              </div>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest shrink-0">Text Input</span>
            </div>
            
            <textarea
              required
              rows={14}
              placeholder="PASTE YOUR RESUME HERE...&#10;&#10;e.g.&#10;John Doe - Software Engineer&#10;Experience:&#10;- Led team to rebuild cloud-native backend on AWS...&#10;- Maintained database and API services..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-xl p-4 text-xs font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y min-h-[300px]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">query_stats</span>
                Analyze with AI Agent
              </button>
            </div>
          </div>

          {/* Config sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium space-y-4">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm fill">auto_awesome</span>
                Audit Scope Target
              </h4>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary outline-none cursor-pointer"
                  >
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-surface-container rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">How ATS Audits Work</h4>
              <ul className="space-y-3.5 text-xs text-on-surface-variant leading-relaxed">
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm shrink-0">check_circle</span>
                  <span><strong>ATS Filter Matcher</strong> scans for high-density modern tech keywords.</span>
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm shrink-0">check_circle</span>
                  <span><strong>Google Formula Critiques</strong> measures achievements against measurable metrics.</span>
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm shrink-0">check_circle</span>
                  <span><strong>Structure Validator</strong> checks for fonts, columns, and parsing hazards.</span>
                </li>
              </ul>
            </div>
          </div>
        </form>
      )}

      {uploadState === 'scanning' && (
        <div className="flex flex-col items-center justify-center p-16 md:p-24 bg-surface-container-lowest border border-surface-container shadow-premium rounded-2xl text-center">
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-4xl animate-pulse fill">
              auto_awesome
            </span>
          </div>
          <h3 className="text-xl font-bold text-on-surface">AI is analyzing your resume...</h3>
          <p className="text-sm text-secondary mt-2 font-medium">Checking ATS compatibility & semantic keyword density for "{targetRole}"</p>
        </div>
      )}

      {uploadState === 'results' && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Preview */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-surface-container-high pb-3 shrink-0">
              <h4 className="text-xs font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-lg">description</span>
                Dynamic_CV_Submission.pdf
              </h4>
              <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded font-bold uppercase tracking-wider shrink-0">
                Parsed
              </span>
            </div>
            <div className="flex-1 bg-surface-container-low border border-surface-container rounded-xl p-5 overflow-y-auto text-xs text-on-surface-variant font-mono space-y-4 opacity-90 min-h-[360px] max-h-[500px]">
              <div className="h-4 bg-outline-variant/30 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-5/6"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-4/6 mb-4"></div>
              
              <div className="h-4 bg-outline-variant/30 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-3/4 mb-4"></div>

              {analysis.priorityFixes.slice(0, 1).map((fix, idx) => (
                <div key={idx} className="p-3 bg-error/5 border-l-4 border-error rounded-r-lg space-y-1.5 font-sans">
                  <div className="font-semibold text-error flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-sm font-bold">warning</span>
                    ATS Parser Hazard Detected
                  </div>
                  <div className="text-on-surface-variant text-[11px] leading-relaxed">
                    "{fix.title}" - {fix.desc}
                  </div>
                </div>
              ))}

              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-4/5"></div>
            </div>
          </div>

          {/* Right: AI Scorecards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Bento Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-premium flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                  <span className="text-xs text-outline uppercase tracking-wider font-bold">ATS Score</span>
                </div>
                <div>
                  <div className="flex items-end gap-0.5">
                    <span className="text-5xl font-black text-on-surface tracking-tight">{analysis.atsScore}</span>
                    <span className="text-sm font-bold text-outline mb-1">/100</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${analysis.atsScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-premium flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary">vpn_key</span>
                  <span className="text-xs text-outline uppercase tracking-wider font-bold">Keyword Density</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-secondary">{analysis.keywordMatch} Match</span>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {analysis.keywordMatchDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-premium">
              <h4 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary font-bold">auto_awesome</span>
                Core Actionable Suggestions
              </h4>
              <div className="space-y-4">
                {analysis.actionableSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl bg-surface-container-low border border-surface-container hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="mt-0.5 shrink-0">
                      <span className={`material-symbols-outlined ${suggestion.type === 'warning' ? 'text-error' : 'text-primary'}`}>
                        {suggestion.type === 'warning' ? 'warning' : 'add_circle'}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-on-surface">{suggestion.title}</h5>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed font-medium">
                        {suggestion.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Card to Full Report */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-primary/5 border border-primary/20 p-6 rounded-2xl">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-on-surface">Full Resume Audit Ready</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We've parsed section headers, word count, grammar, formatting, and industry alignments.
                </p>
              </div>
              <button
                onClick={() => navigate('/resume/feedback')}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
              >
                View Detailed AI Report
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
