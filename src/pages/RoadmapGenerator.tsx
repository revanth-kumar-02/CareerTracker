import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../utils/aiService';
import { saveRoadmap } from '../utils/supabaseClient';
import { AVAILABLE_ROLES } from '../data/staticContent';
import { useProfile } from '../context/ProfileContext';

export default function RoadmapGenerator() {
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useProfile();
  
  // Customization Form states
  const [targetRole, setTargetRole] = useState(AVAILABLE_ROLES[0]);
  const [skillsInput, setSkillsInput] = useState('');
  const [duration, setDuration] = useState('6 Months');

  // Generator Loading states
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Animated loading messages
  const loadingMessages = [
    "Contacting AI Career Engine...",
    "Querying global competency matrix benchmarks for your target role...",
    "Scanning industry skill demands and regional market gaps...",
    "Formulating optimal 3-stage visual timeline parameters...",
    "Curating customized, recommended next-step learning assets...",
    "Writing active pathway blueprints securely to Cloud..."
  ];

  useEffect(() => {
    if (profile?.target_role) {
      setTargetRole(profile.target_role);
    }
  }, [profile]);

  useEffect(() => {
    let interval: any;
    if (generating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) return;

    setGenerating(true);
    try {
      // 1. Synthesize roadmap via Gemini 2.5 Pro (enriching with duration context)
      const enrichment = `${skillsInput.trim() ? `Current Skills: ${skillsInput.trim()}. ` : ""}Preferred Timeline Limit: ${duration}.`;
      const data = await generateRoadmap(targetRole, enrichment);

      // 2. Save roadmap JSON directly to Supabase
      await saveRoadmap(data);

      // 3. Keep profile synchronized (updating target role and initial dynamic briefing via context)
      await updateProfile({
        target_role: targetRole,
        briefing: `Dynamic learning trajectory active for your path to become a ${targetRole}. System components are primed.`
      });

      // 4. Redirect user to the main Career Roadmap page to display active tracker
      navigate('/roadmap');
    } catch (err) {
      console.error("Roadmap generation failed:", err);
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing Parameters with Cloud...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-[480px] flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container rounded-2xl p-12 shadow-premium text-center space-y-6 animate-fade-in max-w-2xl mx-auto my-10">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="material-symbols-outlined text-3xl text-primary animate-pulse fill">auto_awesome</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-on-surface animate-pulse">Synthesizing Custom Blueprint</h3>
          <p className="text-xs text-primary font-bold min-h-[1.5rem] tracking-wide px-4">
            {loadingMessages[loadingStep]}
          </p>
          <p className="text-[10px] text-on-surface-variant font-semibold">
            Using advanced LLM systems for structural validation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <header className="mb-4">
        <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary font-bold">route</span>
          Roadmap Customizer
        </h1>
        <p className="text-body-lg text-on-surface-variant font-semibold">
          Configure dynamic parameters to synthesize a multi-stage career learning timeline.
        </p>
      </header>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-surface-container rounded-2xl p-8 shadow-premium space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1 pb-4 border-b border-surface-container-high">
          <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            AI Personalized Pathway Builder
          </h3>
          <p className="text-xs text-on-surface-variant">The AI will model a target timeline, competency maps, and recommend courses.</p>
        </div>

        <div className="space-y-5">
          {/* Target Role Dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Target Professional Title</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-semibold text-on-surface focus:border-primary cursor-pointer outline-none transition-all"
            >
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Timeline / Duration Toggle */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Path Velocity (Target Duration)</label>
            <div className="grid grid-cols-3 gap-3">
              {['3 Months', '6 Months', '12 Months'].map((opt) => {
                const isActive = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-primary/10 border-primary text-primary shadow-sm'
                        : 'bg-surface border-outline-variant/20 text-on-surface hover:border-primary/45'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Current Skills / Focus area */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Skills Focus Areas / Current Skill Gaps (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. React basics, AWS databases, container scaling, system optimization"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-semibold text-on-surface focus:border-primary outline-none transition-all"
            />
            <p className="text-[10px] text-on-surface-variant font-medium">
              Separate with commas. The AI will strategically adjust progress maps and emphasize these competencies.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-surface-container-high flex justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="px-6 py-3 border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-xl text-xs font-extrabold transition-all cursor-pointer"
          >
            Cancel &amp; Go Back
          </button>
          
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-on-primary rounded-xl text-xs font-extrabold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">rocket_launch</span>
            Synthesize Custom AI Pathway
          </button>
        </div>
      </form>

    </div>
  );
}
