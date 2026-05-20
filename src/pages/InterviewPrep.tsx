import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import { interviewMessages } from '../data/mockData';

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [micActive, setMicActive] = useState(true);
  const [messages, setMessages] = useState(interviewMessages);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-6">
        <div>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-1">AI Interview Prep</h1>
          <p className="text-body-lg text-on-surface-variant">
            Real-time AI behavioral &amp; technical interview coach.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/interview/simulator')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity shadow-md ai-glow"
          >
            <span className="material-symbols-outlined text-base">video_chat</span>
            Launch Immersive Simulator
          </button>
        </div>
      </header>

      {/* Main Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video & Chat Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          {/* Webcam Simulator Box */}
          <div className="h-64 rounded-xl bg-inverse-surface relative overflow-hidden flex items-center justify-center shadow-md border border-outline-variant/10">
            {/* Webcam Feed Mock Image */}
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80')`,
              }}
            ></div>
            <div className="z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface/10 backdrop-blur-md border border-white/25 flex items-center justify-center mb-4 shadow">
                <span className="material-symbols-outlined text-white text-3xl">videocam</span>
              </div>
              {/* Speaking Soundwave indicators */}
              <div className="flex items-end gap-1 h-8">
                <div className="w-2.5 bg-primary-fixed-dim rounded-t-full wave-bar h-3"></div>
                <div className="w-2.5 bg-primary-fixed rounded-t-full wave-bar h-6"></div>
                <div className="w-2.5 bg-primary-fixed rounded-t-full wave-bar h-8"></div>
                <div className="w-2.5 bg-primary-fixed rounded-t-full wave-bar h-5"></div>
                <div className="w-2.5 bg-primary-fixed-dim rounded-t-full wave-bar h-2"></div>
              </div>
              <span className="text-[10px] text-white/80 font-bold mt-2 uppercase tracking-widest">
                Speaking Now
              </span>
            </div>
          </div>

          {/* Conversational Feed Box */}
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between bg-surface-container-lowest min-h-[350px]">
            <div className="space-y-6 overflow-y-auto max-h-[320px] pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-secondary-fixed text-secondary font-bold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{msg.avatar}</span>
                  </div>
                  <div
                    className={`p-4 rounded-xl text-xs leading-relaxed max-w-[80%] border ${
                      msg.sender === 'user'
                        ? 'bg-primary/5 border-primary/20 text-on-surface rounded-tr-none'
                        : 'bg-surface-container-high border-outline-variant/20 text-on-surface rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Analysis indicator */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1 p-3 bg-surface-container rounded-xl rounded-tl-none w-16 justify-center">
                    <div className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-outline font-bold">Analyzing speech patterns...</span>
                </div>
              </div>
            </div>

            {/* Input area mockup */}
            <div className="mt-6 pt-4 border-t border-outline-variant/25 flex gap-4 items-center">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  micActive
                    ? 'bg-primary text-on-primary hover:bg-primary/90'
                    : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {micActive ? 'mic' : 'mic_off'}
                </span>
              </button>
              <div className="flex-1 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/35 text-outline text-xs font-medium flex items-center">
                {micActive ? 'Active transcription listening...' : 'Microphone muted. Tap to activate.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Coaching Metrics Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Time Remaining Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider mb-2">
              Time Remaining
            </span>
            <div className="text-3xl font-extrabold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-2xl">timer</span>
              12:45
            </div>
          </div>

          {/* Question Progression */}
          <div className="glass-card rounded-xl p-6 flex flex-col border border-surface-container">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                Progress
              </span>
              <span className="text-base font-extrabold text-on-surface">
                3 <span className="text-outline text-xs font-semibold">/ 5 Questions</span>
              </span>
            </div>
            <div className="flex gap-1.5 mb-4">
              <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
              <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
              <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
              <div className="h-1.5 flex-1 bg-surface-container rounded-full"></div>
              <div className="h-1.5 flex-1 bg-surface-container rounded-full"></div>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Behavioral: Overcoming Engineering Challenges
            </p>
          </div>

          {/* Real-time Confidence Ring */}
          <div className="glass-card rounded-xl p-6 flex-grow flex flex-col border border-surface-container">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary">monitor_heart</span>
              Live Confidence Index
            </span>
            <div className="flex-1 flex flex-col justify-center items-center relative py-4">
              <CircularProgress value={80} size={130} strokeWidth={9} color="#6b38d4">
                <span className="text-3xl font-extrabold text-on-surface">80%</span>
                <span className="text-[10px] text-outline font-bold">Pacing is excellent</span>
              </CircularProgress>
            </div>
            <div className="mt-4 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/15 flex gap-3 items-start">
              <span className="material-symbols-outlined text-secondary-container text-base shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Minimizing filler words ("um", "like") will optimize clarity. Your technical depth is highly rated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
