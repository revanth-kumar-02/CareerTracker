import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsedResumeMetadata, actionableSuggestions } from '../data/mockData';

export default function ResumeLab() {
  const [uploadState, setUploadState] = useState<'idle' | 'scanning' | 'results'>('idle');
  const navigate = useNavigate();

  const handleSimulateUpload = () => {
    setUploadState('scanning');
    setTimeout(() => {
      setUploadState('results');
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface mb-2">Resume Lab</h1>
        <p className="text-body-lg text-on-surface-variant">Optimize your CV for modern ATS and hiring managers.</p>
      </header>

      {uploadState === 'idle' && (
        <div
          onClick={handleSimulateUpload}
          className="upload-dashed p-16 md:p-24 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 group bg-surface-container-lowest"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-fixed transition-colors duration-300">
            <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-2">Drop your resume for AI optimization</h3>
          <p className="text-sm text-outline">Supported formats: PDF, DOCX (Max 5MB)</p>
          <button className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-md hover:bg-primary/95 transition-all">
            Browse Files
          </button>
        </div>
      )}

      {uploadState === 'scanning' && (
        <div className="flex flex-col items-center justify-center p-16 md:p-24 glass-card rounded-xl">
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 border-4 border-outline-variant rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-4xl ai-glow-animate">
              psychology
            </span>
          </div>
          <h3 className="text-xl font-bold text-on-surface">AI is analyzing your resume...</h3>
          <p className="text-sm text-secondary mt-2">Checking ATS compatibility & semantic keyword density</p>
        </div>
      )}

      {uploadState === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Preview */}
          <div className="lg:col-span-5 glass-card rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-3">
              <h4 className="text-xs font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-lg">description</span>
                {parsedResumeMetadata.filename}
              </h4>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                {parsedResumeMetadata.status}
              </span>
            </div>
            <div className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg p-5 overflow-y-auto text-xs text-on-surface-variant font-mono space-y-3 opacity-90 min-h-[400px] max-h-[500px]">
              <div className="h-4 bg-outline-variant/30 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-5/6"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-4/6 mb-4"></div>
              
              <div className="h-4 bg-outline-variant/30 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-3/4 mb-4"></div>

              <div className="p-3 bg-error/10 border-l-4 border-error rounded-r-lg space-y-2">
                <div className="font-semibold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  ATS Conflict Detected
                </div>
                <div className="text-on-surface-variant font-sans">
                  "Led project X to migrate monolithic systems..." - Lack of quantifiable accomplishments.
                </div>
              </div>

              <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-4/5"></div>
            </div>
          </div>

          {/* Right: AI Scorecards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Bento Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                  <span className="text-xs text-outline uppercase tracking-wider font-semibold">ATS Score</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-on-surface">{parsedResumeMetadata.atsScore}</span>
                  <span className="text-base text-outline mb-1">/100</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full mt-6 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${parsedResumeMetadata.atsScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary">vpn_key</span>
                  <span className="text-xs text-outline uppercase tracking-wider font-semibold">Keyword Match</span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-secondary">{parsedResumeMetadata.keywordMatch}</span>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    {parsedResumeMetadata.keywordMatchDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="glass-card p-6 rounded-xl">
              <h4 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-container ai-glow">lightbulb</span>
                Actionable Suggestions
              </h4>
              <div className="space-y-4">
                {actionableSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
                    <div className="mt-0.5">
                      <span className={`material-symbols-outlined ${suggestion.type === 'warning' ? 'text-error' : 'text-primary'}`}>
                        {suggestion.type === 'warning' ? 'warning' : 'add_circle'}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-on-surface">{suggestion.title}</h5>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {suggestion.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Card to Full Report */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-primary/5 border border-primary/20 p-6 rounded-xl">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-on-surface">Full Analysis Ready</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We've parsed section headers, word count, grammar, formatting, and industry alignments.
                </p>
              </div>
              <button
                onClick={() => navigate('/resume/feedback')}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1 shrink-0"
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
