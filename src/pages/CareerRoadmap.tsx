import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicRoadmap } from '../utils/aiService';
import { useProfile } from '../context/ProfileContext';

export default function CareerRoadmap() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const raw = profile?.roadmap as DynamicRoadmap | null;
  // Only treat as valid roadmap if it has the required stages array
  const roadmap = (raw && Array.isArray(raw.stages) && raw.stages.length > 0) ? raw : null;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant font-bold">Synchronizing Roadmap with Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, nav, .no-print, header .flex.gap-3, button, a {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .bg-surface-container-lowest, .bg-surface-container-low, .bg-surface-container {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            color: #000000 !important;
          }
          .shadow-level-2, .shadow-premium, .shadow-sm, .shadow-md {
            box-shadow: none !important;
          }
          .grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .roadmap-item {
            page-break-inside: avoid;
          }
        }
      `}} />
      {roadmap ? (
        <>
          {/* Header Section */}
          <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-surface-container-highest pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-surface-container-high text-primary rounded text-[10px] font-bold tracking-wider uppercase">
                  TARGET PATH
                </span>
                <span className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded text-[10px] font-bold tracking-wider flex items-center gap-1 ai-glow">
                  <span className="material-symbols-outlined text-[13px] fill">auto_awesome</span>
                  AI Synthesized
                </span>
              </div>
              <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface">
                {roadmap.targetRole}
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                {roadmap.description}
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={() => navigate('/roadmap/generator')}
                className="flex-1 lg:flex-none px-5 py-3 bg-surface-container-lowest text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base font-bold">auto_awesome</span>
                Regenerate Path
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 lg:flex-none px-6 py-3 bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Export PDF
              </button>
              <button
                onClick={() => navigate('/discovery')}
                className="flex-1 lg:flex-none px-6 py-3 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">explore</span>
                Market Pulse
              </button>
            </div>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Roadmap Vertical Timeline (Left Column) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-background flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">route</span>
                Career Journey
              </h3>
              <div className="relative pl-2">
                {roadmap.stages.map((stage) => {
                  if (stage.status === 'Completed') {
                    return (
                      <div key={stage.stage} className="roadmap-item relative flex gap-6 mb-10">
                        <div className="roadmap-line relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
                            <span className="material-symbols-outlined font-bold text-base">check</span>
                          </div>
                        </div>
                        <div className="flex-grow bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container opacity-80 hover:opacity-100 transition-opacity duration-300">
                          <div className="flex justify-between items-start mb-3 gap-2 flex-wrap sm:flex-nowrap">
                            <div>
                              <span className="text-[10px] font-bold text-primary mb-1 block uppercase tracking-wider">
                                Stage {stage.stage} • Completed
                              </span>
                              <h4 className="text-base font-bold text-on-surface">{stage.title}</h4>
                            </div>
                            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full shrink-0">
                              {stage.timeline}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                            {stage.desc}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(stage.skills || []).map((skill) => (
                              <span key={skill} className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded text-[10px] font-semibold border border-outline-variant/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (stage.status === 'In Progress') {
                    return (
                      <div key={stage.stage} className="roadmap-item relative flex gap-6 mb-10">
                        <div className="roadmap-line relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-[3px] border-primary text-primary flex items-center justify-center shadow-lg ai-glow shrink-0 relative">
                            <span className="material-symbols-outlined animate-pulse text-xl">more_horiz</span>
                            <svg className="absolute -inset-1.5 w-15 h-15 transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" fill="none" r="45" stroke="#e5eeff" strokeWidth="4"></circle>
                              <circle cx="50" cy="50" fill="none" r="45" stroke="#4648d4" strokeDasharray="283" strokeDashoffset="90" strokeLinecap="round" strokeWidth="4" className="transition-all duration-1000 ease-out"></circle>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-grow bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border-l-4 border-l-primary relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-container/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32"></div>
                          <div className="flex justify-between items-start mb-4 gap-2 relative z-10 flex-wrap sm:flex-nowrap">
                            <div>
                              <span className="text-[10px] font-bold text-secondary mb-1 block uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                                In Progress • Current Focus
                              </span>
                              <h4 className="text-base font-bold text-on-surface">{stage.title}</h4>
                            </div>
                            <span className="text-xs font-semibold text-primary-container bg-primary/10 px-3 py-1 rounded-full shrink-0">
                              {stage.timeline}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed relative z-10">
                            {stage.desc}
                          </p>
                          <div className="flex flex-col gap-2.5 mb-4 relative z-10">
                            {(stage.subtasks || []).map((subtask) => (
                              <div key={subtask.name} className={`flex items-center justify-between p-3 rounded-lg border ${subtask.status === 'In Progress' ? 'bg-surface-container-low border-primary/10' : 'bg-surface-container-lowest border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer'}`}>
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${subtask.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                                    <span className="material-symbols-outlined text-base">
                                      {subtask.status === 'In Progress' ? 'code' : 'view_in_ar'}
                                    </span>
                                  </div>
                                  <span className="text-xs font-semibold text-on-surface">{subtask.name}</span>
                                </div>
                                {subtask.status === 'In Progress' ? (
                                  <span className="text-xs text-primary font-bold">{subtask.percentage}</span>
                                ) : (
                                  <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-bold">
                                    {subtask.percentage}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <button className="text-primary font-bold text-xs flex items-center gap-0.5 hover:text-primary/80 transition-colors relative z-10 cursor-pointer">
                            View Learning Path Details
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={stage.stage} className="roadmap-item relative flex gap-6">
                      <div className="roadmap-line relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-surface-container text-outline flex items-center justify-center border border-outline-variant/30 shrink-0">
                          <span className="material-symbols-outlined text-base">lock</span>
                        </div>
                      </div>
                      <div className="flex-grow bg-surface-container-lowest/50 rounded-xl p-6 border border-outline-variant/20 opacity-60 grayscale-[40%] hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                        <div className="flex justify-between items-start mb-3 gap-2 flex-wrap sm:flex-nowrap">
                          <div>
                            <span className="text-[10px] font-bold text-outline mb-1 block uppercase tracking-wider">
                              Stage {stage.stage} • Locked
                            </span>
                            <h4 className="text-base font-bold text-on-surface">{stage.title}</h4>
                          </div>
                          <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full shrink-0">
                            {stage.timeline}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                          {stage.desc}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(stage.skills || []).map((skill) => (
                            <span key={skill} className="px-2.5 py-1 bg-surface-container-lowest text-outline rounded text-[10px] font-semibold border border-outline-variant/20 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">lock_clock</span>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analytics & Side Panels (Right Column) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Success Probability Card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5 relative z-10">
                    <span className="material-symbols-outlined text-secondary">trending_up</span>
                    Success Probability
                  </h3>
                  <div className="flex items-end gap-0.5 mb-2 relative z-10">
                    <span className="text-5xl font-extrabold text-on-surface tracking-tight">{roadmap.successProbability}</span>
                    <span className="text-xl font-bold text-on-surface-variant pb-1">%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4 relative z-10">
                    {roadmap.successReason}
                  </p>
                </div>
                {/* Trend Graphic */}
                <div className="h-24 w-full bg-surface-container-low rounded-lg relative overflow-hidden flex items-end px-2 pb-2 gap-1 relative z-10 border border-outline-variant/15 animate-fade-in">
                  <div className="w-1/6 bg-primary/20 h-[30%] rounded-sm"></div>
                  <div className="w-1/6 bg-primary/45 h-[45%] rounded-sm"></div>
                  <div className="w-1/6 bg-primary/60 h-[50%] rounded-sm"></div>
                  <div className="w-1/6 bg-primary/80 h-[70%] rounded-sm"></div>
                  <div className="w-1/6 bg-secondary h-[85%] rounded-sm shadow-[0_0_10px_rgba(107,56,212,0.4)]"></div>
                  <div className="w-1/6 border-2 border-dashed border-outline-variant/60 h-[95%] rounded-sm bg-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Skill Gap Visualization */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary">radar</span>
                  Skill Gap Analysis
                </h3>
                <div className="space-y-4">
                  {(roadmap.skillGaps || []).map((gap) => (
                    <div key={gap.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-on-surface font-semibold">{gap.name}</span>
                        <span className={`${gap.aiSuggestion ? 'text-secondary' : 'text-primary'} font-bold`}>{gap.level}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div
                          className={`h-full ${gap.colorClass} ${gap.progressWidth === '2/5' ? 'rounded-l-full w-2/5' : 'rounded-full'}`}
                          style={{ width: gap.progressWidth === '3/5' ? '60%' : gap.progressWidth === '2/5' ? '40%' : gap.progressWidth === '4/5' ? '80%' : '100%' }}
                        />
                        {gap.aiSuggestion && (
                          <div className="w-1/5 h-full bg-secondary/30 rounded-r-full animate-pulse"></div>
                        )}
                      </div>
                      {gap.aiSuggestion && (
                        <p className="text-[10px] text-secondary font-bold mt-1.5 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs fill">lightbulb</span>
                          AI suggestion priority focus area
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Step Module */}
              <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-6 shadow-level-2 border border-surface-container">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                  {roadmap.recommendedNextStep.category}
                </h3>
                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors cursor-pointer group flex flex-col gap-2 shadow-sm">
                  <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center shrink-0 mb-1 group-hover:scale-105 transition-transform duration-200">
                    <span className="material-symbols-outlined text-lg">{roadmap.recommendedNextStep.icon}</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {roadmap.recommendedNextStep.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {roadmap.recommendedNextStep.desc}
                  </p>
                  <a className="text-primary font-bold text-xs mt-2 flex items-center gap-0.5 hover:underline">
                    {roadmap.recommendedNextStep.buttonLabel}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Premium Stripe-like CTA Banner */
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container rounded-2xl p-12 shadow-premium text-center space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl font-bold">route</span>
          </div>
          <div className="space-y-3 max-w-lg">
            <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Model Your Personalized Career Path</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Unlock a synthesized, AI-engineered 3-stage skill-gap blueprint, customized competency thresholds, success probability indices, and structured action items designed specifically for your professional growth.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap/generator')}
            className="px-8 py-3.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
          >
            <span className="material-symbols-outlined text-sm font-bold">rocket_launch</span>
            Synthesize Your Custom Pathway
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}

