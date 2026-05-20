import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import { DynamicResumeFeedback } from '../utils/aiService';
import { getProfile } from '../utils/supabaseClient';

export default function ResumeFeedback() {
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [analysis, setAnalysis] = useState<DynamicResumeFeedback | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfile();
        if (data && data.resume_analysis) {
          setAnalysis(data.resume_analysis);
        }
      } catch (e) {
        console.error("Failed to load resume analysis from Supabase:", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadData();
  }, []);

  if (loadingProfile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Retrieving Resume Audit Report...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container rounded-2xl p-12 text-center shadow-premium animate-fade-in">
        <div className="w-20 h-20 bg-primary/5 rounded-full border-2 border-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner animate-pulse">
          <span className="material-symbols-outlined text-4xl fill">description</span>
        </div>
        <h2 className="text-2xl font-black text-on-surface mb-2">No Active Resume Audit</h2>
        <p className="text-sm text-on-surface-variant max-w-md mb-8 leading-relaxed font-medium">
          To generate a high-precision ATS compatibility scorecard and a detailed keyword optimization report, please upload or paste your CV in our Resume Lab first.
        </p>
        <button
          onClick={() => navigate('/resume')}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">launch</span>
          Open Resume Lab
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-6">
        <div>
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors mb-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            Back to Resume Lab
          </button>
          <h1 className="font-display-lg text-3xl font-extrabold text-on-surface mb-1">AI Feedback Report</h1>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>Dynamic_CV_Submission.pdf</span>
            <span className="text-outline-variant">•</span>
            <span>Analyzed just now</span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-bold hover:bg-surface-container transition-all text-on-surface">
            <span className="material-symbols-outlined text-sm">visibility</span>
            View Heatmap
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-lg text-xs font-bold hover:opacity-95 transition-opacity ai-glow">
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            Apply All Fixes
          </button>
        </div>
      </div>

      {/* Top Grid: Score & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intelligence Score Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-premium flex flex-col items-center justify-center relative overflow-hidden border border-surface-container">
          <div className="absolute top-4 right-4 text-secondary">
            <span className="material-symbols-outlined fill">auto_awesome</span>
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">Career Intelligence Score</h3>
          <p className="text-xs text-on-surface-variant mb-6 text-center leading-relaxed">
            {analysis.atsScore >= 80 
              ? "Your resume is excellent! Minor tweaks will make it bulletproof." 
              : "Your resume has high potential, but key optimizations are required."}
          </p>
          <CircularProgress value={analysis.atsScore} size={150} strokeWidth={10} color="#4648d4">
            <span className="text-4xl font-extrabold text-primary">{analysis.atsScore}</span>
            <span className="text-[10px] text-on-surface-variant font-semibold mt-0.5">/ 100</span>
          </CircularProgress>
        </div>

        {/* Priority Fixes Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-premium border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error font-bold">priority_high</span>
              Priority Fixes
            </h3>
            <span className="px-2.5 py-1 bg-error/10 text-error rounded text-[10px] font-bold">
              {analysis.priorityFixes.length} High Impact
            </span>
          </div>
          <ul className="flex flex-col gap-3">
            {analysis.priorityFixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-4 p-3 bg-surface-container-low hover:bg-surface-container transition-all duration-200 rounded-lg group cursor-pointer border border-outline-variant/10">
                <div className={`w-8 h-8 rounded-full ${fix.bgClass} ${fix.colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="material-symbols-outlined text-sm">{fix.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-on-surface mb-0.5">{fix.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                    {fix.desc}
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-bold text-xs flex items-center gap-0.5 self-center shrink-0 ml-2">
                  Fix <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bento Grid: Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATS Compatibility */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-premium border border-surface-container">
          <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary font-bold">fact_check</span>
            ATS Compatibility Filters
          </h3>
          <div className="space-y-3">
            {analysis.atsChecklist.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${item.status === 'Pass' ? 'text-primary' : 'text-error'} fill text-lg`}>
                    {item.status === 'Pass' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-xs text-on-surface font-semibold">{item.label}</span>
                </div>
                <span className={`px-2.5 py-0.5 ${item.status === 'Pass' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'} rounded text-[10px] font-extrabold uppercase`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Alignment */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-premium border border-surface-container flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary font-bold">model_training</span>
              Skill Matrix Alignment
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Validated against direct industry requirements in active market sectors.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-on-surface mb-2">Matched Competencies</p>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-surface-container-low text-on-surface rounded-full text-[10px] font-bold border border-outline-variant/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface mb-2">Missing Priority Skills</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-error/5 text-error rounded-full text-[10px] font-bold border border-error/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">add</span> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Impact (Full Width) */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-premium border border-surface-container">
          <div className="flex items-center justify-between mb-4 border-b border-surface-container-high pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary font-bold">edit_note</span>
              Content Impact Analysis
            </h3>
            <span className="text-xs text-on-surface-variant font-bold">Based on Google's X-Y-Z Achievement Standard</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.googleFormulaAnalysis.map((item, idx) => (
              <div key={idx} className={`p-4 bg-surface-container-low rounded-xl border-l-4 ${item.type === 'strong' ? 'border-primary' : 'border-error'} flex flex-col justify-between gap-4 hover:shadow-sm transition-all duration-300`}>
                <div>
                  <p className={`text-xs font-bold ${item.type === 'strong' ? 'text-primary' : 'text-error'} mb-2 flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-base">
                      {item.type === 'strong' ? 'thumb_up' : 'thumb_down'}
                    </span>
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface italic leading-relaxed font-medium">
                    {item.example}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <span key={badge} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.type === 'strong' ? 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20' : 'bg-error/5 text-error border-error/10'}`}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex justify-end pt-4 border-t border-surface-container-highest">
        <button className="flex items-center gap-1.5 px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container hover:text-primary transition-all shadow-sm cursor-pointer">
          <span className="material-symbols-outlined text-sm">download</span>
          Download Audited CV
        </button>
      </div>
    </div>
  );
}
