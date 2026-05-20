import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateInterviewQuestions, generateInterviewFeedback, DynamicInterviewQuestion, DynamicInterviewFeedback } from '../utils/aiService';
import CircularProgress from '../components/ui/CircularProgress';
import { useProfile } from '../context/ProfileContext';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  avatar: string;
  feedback?: DynamicInterviewFeedback;
}

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, updateProfile } = useProfile();
  
  // Session Configuration
  const [config, setConfig] = useState(() => {
    if (location.state && location.state.targetRole) {
      return {
        targetRole: location.state.targetRole,
        interviewType: location.state.interviewType || 'Behavioral (STAR Framework)'
      };
    }
    return { targetRole: 'Senior Cloud Architect', interviewType: 'Behavioral (STAR Framework)' };
  });

  // State Management
  const [questions, setQuestions] = useState<DynamicInterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [feedbackHistory, setFeedbackHistory] = useState<DynamicInterviewFeedback[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript) {
          setInputValue(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript.trim()}` : transcript.trim();
          });
        }
      };
      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
      rec.onend = () => setIsRecording(false);

      recognitionRef.current = rec;
    }
  }, []);

  // Load questions on mount
  useEffect(() => {
    if (initializedRef.current) return;

    async function loadSession() {
      if (!location.state || !location.state.targetRole) {
        if (!profile) return;
      }

      initializedRef.current = true;
      setLoading(true);
      try {
        let activeRole = config.targetRole;
        if (!location.state || !location.state.targetRole) {
          if (profile && profile.target_role) {
            activeRole = profile.target_role;
            setConfig({
              targetRole: profile.target_role,
              interviewType: 'Behavioral (STAR Framework)'
            });
          }
        }
        
        const generated = await generateInterviewQuestions(activeRole);
        setQuestions(generated);
        if (generated.length > 0) {
          setChatHistory([
            {
              sender: 'ai',
              text: `Hello! Welcome to your immersive AI interview for the role of ${activeRole}. Let's begin.\n\nHere is your first question:\n"${generated[0].text}"`,
              avatar: 'smart_toy'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
        initializedRef.current = false;
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [config.targetRole, location.state, profile]);

  // Keep a running session timer
  useEffect(() => {
    if (sessionFinished || loading) return;
    const interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionFinished, loading]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, submitting]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      if (inputValue) return;
      setInputValue("Certainly. In my last project, we had to migrate a monolithic backend to serverless cloud infrastructure on a tight deadline. To maintain high availability, I designed parallel deployment modules using AWS Lambda with optimized API Gateway throttling rates. This mitigated our database bottleneck and resulted in a 40% latency saving under high load.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || submitting || sessionFinished || questions.length === 0) return;

    if (isRecording && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (err) { console.error(err); }
      setIsRecording(false);
    }

    const currentQuestion = questions[currentIdx].text;
    const userAnswer = inputValue.trim();

    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: userAnswer, avatar: 'person' }
    ]);
    setAnswers(prev => [...prev, userAnswer]);
    setInputValue('');
    setSubmitting(true);

    try {
      const feedback = await generateInterviewFeedback(currentQuestion, userAnswer, config.targetRole);
      setFeedbackHistory(prev => [...prev, feedback]);

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Coaching insight: ${feedback.coachingTip}`,
          avatar: 'insights',
          feedback
        }
      ]);

      if (currentIdx < questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            { sender: 'ai', text: `Great. Moving on to Question ${nextIdx + 1}:\n\n"${questions[nextIdx].text}"`, avatar: 'smart_toy' }
          ]);
        }, 1200);
      } else {
        setSessionFinished(true);
        
        const totalConf = feedbackHistory.reduce((sum, f) => sum + f.confidenceIndex, 0) + feedback.confidenceIndex;
        const avgConf = Math.round(totalConf / questions.length);
        const tips = [...feedbackHistory.map(f => f.coachingTip), feedback.coachingTip];

        const historyRecord = {
          targetRole: config.targetRole,
          interviewType: config.interviewType,
          avgConfidence: avgConf > 0 ? avgConf : 80,
          starredSkills: ["STAR Framework", "Technical Execution"],
          coachingTips: tips.length > 0 ? tips : ["Focus on quantifying metrics using the STAR structure."]
        };
        
        const newStreak = profile ? (profile.streak || 0) + 1 : 1;
        const newXp = profile ? (profile.xp || 0) + 150 : 150;
        await updateProfile({
          interview_session: historyRecord,
          streak: newStreak,
          xp: newXp
        });
        
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getLatestMetrics = () => {
    if (feedbackHistory.length === 0) return { confidence: 80, pacing: 'Steady', wpm: 120 };
    const latest = feedbackHistory[feedbackHistory.length - 1];
    return {
      confidence: latest.confidenceIndex,
      pacing: latest.pacingRateText,
      wpm: latest.pacingWordsPerMin
    };
  };

  const metrics = getLatestMetrics();

  return (
    <div className="animate-fade-in flex flex-col min-h-[calc(100vh-6rem)] pb-16 max-w-7xl mx-auto font-sans">
      
      {/* Premium Spacious Header */}
      <div className="flex justify-between items-end mb-8 shrink-0 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <p className="text-[11px] font-extrabold text-primary uppercase tracking-[0.2em]">Active Simulation</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight leading-none">{config.targetRole}</h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="text-xl md:text-2xl font-black text-on-surface font-mono tracking-tight">{formatTime(timerSeconds)}</div>
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error hover:bg-error hover:text-on-error rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">stop_circle</span>
            End Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container/50 rounded-3xl p-12 text-center shadow-premium mx-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin mb-6 shadow-sm"></div>
          <h3 className="text-xl font-black text-on-surface tracking-tight">Initializing Coaching Engine</h3>
          <p className="text-sm text-on-surface-variant mt-2 font-medium max-w-md leading-relaxed">
            Generating highly-targeted professional Q&amp;A models for "{config.targetRole}"...
          </p>
        </div>
      ) : sessionFinished ? (
        <div className="flex-1 bg-surface-container-lowest border border-surface-container/50 rounded-3xl p-12 shadow-premium flex flex-col items-center justify-center text-center space-y-8 overflow-y-auto mx-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-5xl fill animate-pulse">workspace_premium</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Session Complete</h2>
            <p className="text-sm text-on-surface-variant font-medium">Your interview metrics have been successfully calibrated.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl w-full">
            <div className="bg-surface p-8 rounded-3xl border border-surface-container flex flex-col items-center justify-center shadow-sm">
              <CircularProgress
                value={metrics.confidence}
                max={100}
                size={130}
                strokeWidth={10}
                color="#6b38d4"
              >
                <span className="text-4xl font-black text-on-surface tracking-tight">{metrics.confidence}%</span>
              </CircularProgress>
              <span className="text-[10px] font-extrabold text-outline uppercase tracking-widest mt-5">Avg Confidence Score</span>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-surface-container flex flex-col items-center justify-center shadow-sm space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-3xl fill">insights</span>
              </div>
              <h4 className="text-lg font-black text-on-surface tracking-tight">Speech Pacing Index</h4>
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-extrabold rounded-lg border border-secondary/20 shadow-sm">
                {metrics.pacing} ({metrics.wpm} WPM)
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/interview')}
            className="px-8 py-4 bg-primary text-on-primary rounded-2xl text-sm font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/95 transition-all cursor-pointer mt-4"
          >
            Return to Coaching Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mx-4">
          
          {/* FOCAL POINT: The Immersive Question & Chat Stage */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Massive Question Box */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-12 shadow-premium border border-surface-container relative overflow-hidden flex flex-col justify-center min-h-[260px] shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg shrink-0">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[10px] text-primary font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Active Question
                  </p>
                  <h3 className="text-xl lg:text-2xl font-black text-on-surface leading-snug tracking-tight">
                    {questions[currentIdx]?.text}
                  </h3>
                </div>
              </div>
            </div>

            {/* Expansive Chat Timeline */}
            <div className="h-[480px] bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container flex flex-col overflow-hidden">
              <div className="flex-grow p-6 lg:p-8 overflow-y-auto space-y-6">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center font-bold text-[14px] shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-primary-container text-on-primary-container'
                        : msg.avatar === 'insights'
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'bg-surface-container-high text-on-surface'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{msg.avatar}</span>
                    </div>

                    <div className={`p-5 rounded-3xl text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-primary/5 border border-primary/10 text-on-surface rounded-tr-sm'
                        : msg.avatar === 'insights'
                        ? 'bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/20 text-on-surface rounded-tl-sm font-medium'
                        : 'bg-surface-container-low text-on-surface rounded-tl-sm font-medium'
                    }`}>
                      {msg.text}
                      
                      {msg.feedback && (
                        <div className="mt-4 pt-3 border-t border-surface-container-highest flex flex-wrap gap-2 text-[10px] font-bold">
                          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md">Confidence: {msg.feedback.confidenceIndex}%</span>
                          <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-md">Pacing: {msg.feedback.pacingRateText}</span>
                          <span className={`px-2.5 py-1 rounded-md ${msg.feedback.isSTARCompliant ? 'bg-primary/10 text-primary' : 'bg-outline-variant/20 text-outline'}`}>
                            {msg.feedback.isSTARCompliant ? 'STAR Structured ✓' : 'No STAR Pattern Detected'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {submitting && (
                  <div className="flex gap-4 items-center pl-2">
                    <div className="flex space-x-1 p-4 bg-surface-container-low rounded-2xl rounded-tl-sm justify-center w-20">
                      <div className="w-2 h-2 bg-outline-variant rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-outline font-bold">AI Coach is auditing structure...</span>
                  </div>
                )}
                <div ref={chatEndRef} className="h-4" />
              </div>

              {/* Premium Input Area */}
              <form onSubmit={handleSubmitAnswer} className="p-4 lg:p-6 bg-surface-container-lowest border-t border-surface-container flex gap-4 items-center shrink-0">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer ${
                    isRecording
                      ? 'bg-error text-on-error animate-pulse ring-4 ring-error/20 shadow-lg'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary shadow-sm'
                  }`}
                  title={isRecording ? "Stop voice recording" : "Speak your response"}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isRecording ? 'graphic_eq' : 'mic'}
                  </span>
                </button>

                <input
                  type="text"
                  required
                  disabled={submitting || sessionFinished}
                  placeholder={submitting ? 'Auditing response...' : "Type your response, or use the microphone..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow bg-surface border border-outline-variant/30 rounded-2xl px-6 py-4 text-sm font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:opacity-50 transition-all shadow-sm"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || submitting}
                  className="px-8 py-4 bg-primary text-on-primary font-black text-sm hover:bg-primary/95 rounded-2xl transition-all cursor-pointer shrink-0 disabled:opacity-40 shadow-md shadow-primary/20"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* SECONDARY: Calm, Breathing Metrics Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-transparent flex flex-col gap-6">
              
              {/* Progress Tracker (Soft card) */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 border border-surface-container/50 shadow-sm flex flex-col gap-4 shrink-0">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest">Progress</span>
                  <span className="text-sm font-black text-on-surface">Q{currentIdx + 1} / 5</span>
                </div>
                <div className="flex gap-2 h-2">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <div 
                      key={idx} 
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        idx < currentIdx 
                          ? 'bg-primary' 
                          : idx === currentIdx 
                          ? 'bg-primary/40 animate-pulse' 
                          : 'bg-surface-container-high'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Pacing Chip */}
              <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 flex flex-col justify-center shrink-0">
                <h4 className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">speed</span> Vocal Pacing
                </h4>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-on-surface tracking-tight">{metrics.wpm}</span>
                  <span className="text-xs font-bold text-on-surface-variant mb-1">WPM</span>
                </div>
                <p className="text-[11px] font-bold text-secondary mt-1">{metrics.pacing}</p>
              </div>

              {/* Confidence Meter */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container/50 shadow-sm flex-grow">
                <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-6 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">psychology</span> Live Confidence
                </h4>
                <div className="flex flex-col items-center justify-center">
                  <CircularProgress
                    value={metrics.confidence}
                    max={100}
                    size={100}
                    strokeWidth={8}
                    color="#6b38d4"
                    trackColor="#f1f5f9"
                  >
                    <span className="text-2xl font-black text-on-surface">{metrics.confidence}%</span>
                  </CircularProgress>
                </div>
                
                {feedbackHistory.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-surface-container-high space-y-3">
                    <p className="text-[10px] font-extrabold text-outline uppercase tracking-wider">Latest Coach Tip</p>
                    <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
                      "{feedbackHistory[feedbackHistory.length - 1].coachingTip}"
                    </p>
                  </div>
                )}
              </div>

            </div>
          </aside>
          
        </div>
      )}
    </div>
  );
}
