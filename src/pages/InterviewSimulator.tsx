import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  targetRoleDetails,
  liveCoachingMetrics,
  targetRoleRequirements,
  parsedResumeHighlights,
} from '../data/mockData';

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'job' | 'resume'>('job');
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState('04:12');

  return (
    <div className="space-y-6 animate-fade-in max-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header/Status */}
      <div className="flex justify-between items-center bg-surface-container-lowest rounded-xl p-4 border border-surface-container shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">{targetRoleDetails.title}</h2>
            <p className="text-[10px] text-on-surface-variant font-medium">Immersive Voice Simulation Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-on-surface font-mono">{timer}</div>
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center gap-1 px-3 py-1.5 border border-error/20 bg-error/5 text-error hover:bg-error hover:text-on-error rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">stop_circle</span>
            End
          </button>
        </div>
      </div>

      {/* Main Simulation Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
        {/* Center Stage: AI Avatar & Question */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          {/* Avatar Container */}
          <div className="flex-grow flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-container relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-surface-container-low/40 to-transparent pointer-events-none"></div>

            {/* Orbiting geometric sphere SVG/CSS visualizer */}
            <div className="w-40 h-40 rounded-full mb-6 relative bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center shadow-inner">
              {/* Inner glowing sphere */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg ai-glow animate-pulse">
                <span className="material-symbols-outlined text-4xl fill animate-spin" style={{ animationDuration: '8s' }}>
                  auto_awesome
                </span>
              </div>
              {/* Rotating outer orbit rings */}
              <svg className="absolute inset-0 w-full h-full text-primary/30 animate-spin" style={{ animationDuration: '15s' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeDasharray="3 7" strokeWidth="0.75"></circle>
              </svg>
              <svg className="absolute inset-0 w-full h-full text-secondary/35 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeDasharray="5 5" strokeWidth="0.5"></circle>
              </svg>
            </div>

            <div className="text-center max-w-xl z-10 space-y-2">
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Current Question</p>
              <h3 className="text-base md:text-lg font-bold text-on-surface leading-relaxed">
                "Can you describe a time when you had to balance user needs with strict technical constraints on a tight deadline?"
              </h3>
            </div>
          </div>

          {/* Transcript & Voice controls */}
          <div className="h-56 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col overflow-hidden shrink-0">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {/* AI bubble */}
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-xs">smart_toy</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg rounded-tl-none border border-outline-variant/10 text-xs text-on-surface">
                  Can you describe a time when you had to balance user needs with strict technical constraints on a tight deadline?
                </div>
              </div>
              {/* User transcript */}
              <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-secondary-container shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-xs">person</span>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg rounded-tr-none border border-primary/10 text-xs text-on-surface leading-relaxed">
                  Certainly. At my previous role, we were launching a new dashboard. The users wanted real-time analytics updates, but our backend infrastructure couldn't support polling faster than every 5 minutes...
                  <span className="text-on-surface-variant animate-pulse font-semibold ml-1">decided to implement a web socket connection with a debounced update cycle...</span>
                </div>
              </div>
            </div>

            {/* Bottom active controls bar */}
            <div className="p-3 bg-surface border-t border-surface-variant/20 flex justify-between items-center shrink-0">
              <div className="flex gap-1.5">
                <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all flex items-center gap-1 text-xs font-semibold">
                  <span className="material-symbols-outlined text-base">lightbulb</span> Hint
                </button>
                <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all flex items-center gap-1 text-xs font-semibold">
                  <span className="material-symbols-outlined text-base">pause</span> Pause
                </button>
              </div>

              {/* Glowing Mic button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform active:scale-95 ${
                  isMuted
                    ? 'bg-error text-on-error hover:bg-error/90'
                    : 'bg-primary text-on-primary hover:bg-primary/95 ai-glow mic-wave'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
              </button>

              <button className="px-4 py-2 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors">
                Submit Answer
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live metrics and Reference */}
        <aside className="lg:col-span-4 flex flex-col gap-6 h-full shrink-0">
          {/* Live Metrics */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-container shadow-sm">
            <h3 className="text-xs font-bold text-on-surface mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">monitoring</span> Live Coaching Metrics
            </h3>
            <div className="space-y-3">
              {liveCoachingMetrics.map((metric) => (
                <div key={metric.label} className="bg-surface p-3 rounded-lg border border-surface-variant/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-on-surface-variant font-medium">{metric.label}</span>
                    <span className={`text-xs font-bold ${metric.label === 'Confidence Index' ? 'text-secondary' : 'text-primary'}`}>{metric.valueText}</span>
                  </div>
                  {metric.label === 'Confidence Index' ? (
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: metric.progressWidth }}></div>
                    </div>
                  ) : (
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 flex gap-1">
                      <div className="bg-primary/40 h-1.5 rounded-full flex-1"></div>
                      <div className="bg-primary h-1.5 rounded-full flex-1"></div>
                      <div className="bg-primary/45 h-1.5 rounded-full flex-1"></div>
                    </div>
                  )}
                  {metric.label === 'Pacing Rate' && (
                    <p className="text-[10px] text-on-surface-variant mt-1.5 font-medium font-mono">
                      Average 120 words/minute
                    </p>
                  )}
                </div>
              ))}
              {/* Coach text */}
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-2 items-start mt-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">insights</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Excellent usage of the STAR framework. Keep describing the impact: specify metrics like load reductions or latency savings.
                </p>
              </div>
            </div>
          </div>

          {/* Reference tabs */}
          <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col overflow-hidden min-h-[220px]">
            {/* Tabs toggle */}
            <div className="p-1 bg-surface border-b border-surface-variant/20 flex gap-1.5">
              <button
                onClick={() => setActiveTab('job')}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded transition-all cursor-pointer ${
                  activeTab === 'job'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
                }`}
              >
                Job Description
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded transition-all cursor-pointer ${
                  activeTab === 'resume'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
                }`}
              >
                Parsed Resume
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-grow p-4 overflow-y-auto">
              {activeTab === 'job' ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-on-surface">Target Role Requirements</h4>
                  <ul className="space-y-2.5">
                    {targetRoleRequirements.map((req, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                        <p className={`text-xs text-on-surface-variant leading-relaxed ${i === 1 ? 'bg-primary/10 -mx-1 px-1 rounded font-semibold' : ''}`}>
                          {req}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-on-surface">Experience &amp; Skills Highlights</h4>
                  <ul className="space-y-2.5">
                    {parsedResumeHighlights.map((highlight, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                        <p className={`text-xs text-on-surface-variant leading-relaxed ${i === 1 ? 'font-semibold' : ''}`}>
                          {highlight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
