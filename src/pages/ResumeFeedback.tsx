import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import {
  parsedResumeMetadata,
  priorityFixes,
  atsChecklistItems,
  matchedSkills,
  missingSkills,
  googleFormulaAnalysis,
} from '../data/mockData';

export default function ResumeFeedback() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-6">
        <div>
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Resume Lab
          </button>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-1">AI Feedback Report</h1>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>{parsedResumeMetadata.filename}</span>
            <span className="text-outline-variant">•</span>
            <span>Analyzed just now</span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-semibold hover:bg-surface-container transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm">visibility</span>
            View Heatmap
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity ai-glow">
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            Apply All Fixes
          </button>
        </div>
      </div>

      {/* Top Grid: Score & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intelligence Score Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 flex flex-col items-center justify-center relative overflow-hidden border border-surface-container">
          <div className="absolute top-4 right-4 text-secondary-container">
            <span className="material-symbols-outlined fill">auto_awesome</span>
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">Career Intelligence Score</h3>
          <p className="text-xs text-on-surface-variant mb-6 text-center leading-relaxed">
            Your resume is strong, but needs slight optimization for ATS.
          </p>
          <CircularProgress value={82} size={150} strokeWidth={10} color="#4648d4">
            <span className="text-4xl font-extrabold text-primary">82</span>
            <span className="text-[10px] text-on-surface-variant font-semibold mt-0.5">/ 100</span>
          </CircularProgress>
        </div>

        {/* Priority Fixes Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error">priority_high</span>
              Priority Fixes
            </h3>
            <span className="px-2 py-0.5 bg-error/10 text-error rounded text-[10px] font-semibold">
              {priorityFixes.length} High Impact
            </span>
          </div>
          <ul className="flex flex-col gap-3">
            {priorityFixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-4 p-3 bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg group cursor-pointer border border-outline-variant/10">
                <div className={`w-8 h-8 rounded-full ${fix.bgClass} ${fix.colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="material-symbols-outlined text-sm">{fix.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-semibold text-on-surface mb-0.5">{fix.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
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
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
          <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary">fact_check</span>
            ATS Compatibility
          </h3>
          <div className="space-y-3">
            {atsChecklistItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${item.status === 'Pass' ? 'text-primary' : 'text-error'} fill text-lg`}>
                    {item.status === 'Pass' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-xs text-on-surface font-medium">{item.label}</span>
                </div>
                <span className={`px-2 py-0.5 ${item.status === 'Pass' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'} rounded text-[10px] font-bold`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Alignment */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary">model_training</span>
              Skill Alignment
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Compared against 500+ recent 'Product Analyst' job descriptions.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-on-surface mb-2">Matched Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-surface-container-high text-on-surface rounded-full text-[10px] font-medium border border-outline-variant/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface mb-2">Missing High-Value Skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-error/5 text-error rounded-full text-[10px] font-bold border border-error/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">add</span> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Impact (Full Width) */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
          <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Content Impact Analysis
            </h3>
            <span className="text-xs text-on-surface-variant font-semibold">Using Google's X-Y-Z Formula</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {googleFormulaAnalysis.map((item, idx) => (
              <div key={idx} className={`p-4 bg-surface-container-low rounded-lg border-l-4 ${item.type === 'strong' ? 'border-primary' : 'border-error'} flex flex-col justify-between`}>
                <div>
                  <p className={`text-xs font-bold ${item.type === 'strong' ? 'text-primary' : 'text-error'} mb-2 flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-base">
                      {item.type === 'strong' ? 'thumb_up' : 'thumb_down'}
                    </span>
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface italic mb-4 leading-relaxed">
                    {item.example}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.badges.map((badge) => (
                    <span key={badge} className={`px-2 py-0.5 rounded text-[10px] border ${item.type === 'strong' ? 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20' : 'bg-error/5 text-error border-error/10'}`}>
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
        <button className="flex items-center gap-1.5 px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-variant transition-colors shadow-sm">
          <span className="material-symbols-outlined text-sm">download</span>
          Download Optimized Version
        </button>
      </div>
    </div>
  );
}
