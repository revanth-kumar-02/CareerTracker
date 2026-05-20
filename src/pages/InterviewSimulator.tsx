import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateInterviewQuestions, generateInterviewFeedback, DynamicInterviewQuestion, DynamicInterviewFeedback } from '../utils/aiService';
import CircularProgress from '../components/ui/CircularProgress';
import { getProfile, saveInterviewSession, upsertProfile } from '../utils/supabaseClient';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  avatar: string;
  feedback?: DynamicInterviewFeedback;
}

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [isMuted, setIsMuted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load questions on mount
  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      try {
        let activeRole = config.targetRole;
        if (!location.state || !location.state.targetRole) {
          const profile = await getProfile();
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
              text: `Hello! Welcome to your immersive AI interview for the role of ${activeRole}. Let's begin. Question 1: ${generated[0].text}`,
              avatar: 'smart_toy'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [config.targetRole, location.state]);

  // Keep a running session timer
  useEffect(() => {
    if (sessionFinished || loading) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionFinished, loading]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, submitting]);

  // Format timer seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicSimulate = () => {
    if (inputValue) return;
    setInputValue("Certainly. In my last project, we had to migrate a monolithic backend to serverless cloud infrastructure on a tight 3-week deadline. To maintain high availability, I designed parallel deployment modules using AWS Lambda with optimized API Gateway throttling rates. This mitigated our database bottleneck and resulted in a 40% latency saving under high load.");
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || submitting || sessionFinished || questions.length === 0) return;

    const currentQuestion = questions[currentIdx].text;
    const userAnswer = inputValue.trim();

    // 1. Add user answer to chat
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'user',
        text: userAnswer,
        avatar: 'person'
      }
    ]);
    setAnswers(prev => [...prev, userAnswer]);
    setInputValue('');
    setSubmitting(true);

    try {
      // 2. Call Gemini for constructive feedback
      const feedback = await generateInterviewFeedback(currentQuestion, userAnswer, config.targetRole);
      setFeedbackHistory(prev => [...prev, feedback]);

      // 3. Append feedback bubble in chat
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Coaching insight: ${feedback.coachingTip}`,
          avatar: 'insights',
          feedback
        }
      ]);

      // 4. Move to next question or complete session
      if (currentIdx < questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        
        // Brief delay before AI drops the next question
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            {
              sender: 'ai',
              text: `Question ${nextIdx + 1}: ${questions[nextIdx].text}`,
              avatar: 'smart_toy'
            }
          ]);
        }, 1200);
      } else {
        // All 5 questions completed! Save stats and finish.
        setSessionFinished(true);
        
        // Calculate average confidence index
        const totalConf = feedbackHistory.reduce((sum, f) => sum + f.confidenceIndex, 0) + feedback.confidenceIndex;
        const avgConf = Math.round(totalConf / questions.length);

        // Collect coaching recommendations
        const tips = [...feedbackHistory.map(f => f.coachingTip), feedback.coachingTip];

        const historyRecord = {
          targetRole: config.targetRole,
          interviewType: config.interviewType,
          avgConfidence: avgConf > 0 ? avgConf : 80,
          starredSkills: ["STAR Framework", "Technical Execution"],
          coachingTips: tips.length > 0 ? tips : ["Focus on quantifying metrics using the STAR structure."]
        };
        
        // Save session history and update user streak/XP in Supabase
        await saveInterviewSession(historyRecord);
        
        const currentProfile = await getProfile();
        if (currentProfile) {
          const newStreak = (currentProfile.streak || 0) + 1;
          const newXp = (currentProfile.xp || 0) + 150;
          await upsertProfile({
            streak: newStreak,
            xp: newXp
          });
        }
        
        // Dispatch custom event to notify Sidebar/Layout
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getLatestMetrics = () => {
    if (feedbackHistory.length === 0) {
      return { confidence: 80, pacing: 'Steady', wpm: 120 };
    }
    const latest = feedbackHistory[feedbackHistory.length - 1];
    return {
      confidence: latest.confidenceIndex,
      pacing: latest.pacingRateText,
      wpm: latest.pacingWordsPerMin
    };
  };

  const metrics = getLatestMetrics();

  return (
    <div className="space-y-6 animate-fade-in max-h-[calc(100vh-8rem)] flex flex-col pb-16">
      
      {/* Header/Status */}
      <div className="flex justify-between items-center bg-surface-container-lowest rounded-xl p-4 border border-surface-container shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">{config.targetRole}</h2>
            <p className="text-[10px] text-on-surface-variant font-semibold">{config.interviewType}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-on-surface font-mono">{formatTime(timerSeconds)}</div>
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center gap-1 px-3 py-1.5 border border-error/20 bg-error/5 text-error hover:bg-error hover:text-on-error rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">stop_circle</span>
            End Session
          </button>
        </div>
      </div>

      {loading ? (
        /* Dynamic Simulator Loader */
        <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest border border-surface-container rounded-2xl p-12 text-center shadow-premium min-h-[400px]">
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin mb-4"></div>
          <h3 className="text-base font-extrabold text-on-surface">Initializing Immersive Simulator</h3>
          <p className="text-xs text-on-surface-variant mt-1.5 font-medium max-w-sm">Generating highly-targeted professional Q&amp;A models for "{config.targetRole}" using Gemini...</p>
        </div>
      ) : sessionFinished ? (
        /* Immersive Scorecard Wrapup screen */
        <div className="flex-1 bg-surface-container-lowest border border-surface-container rounded-2xl p-8 shadow-premium flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
          <div className="w-20 h-20 bg-primary/5 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-4xl fill animate-pulse">auto_awesome</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-on-surface">Simulator Session Complete</h2>
            <p className="text-xs text-on-surface-variant font-medium">Excellent work! Your interview metrics have been successfully calibrated.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl w-full">
            <div className="bg-surface p-6 rounded-xl border border-surface-container flex flex-col items-center justify-center">
              <CircularProgress
                value={metrics.confidence}
                max={100}
                size={110}
                strokeWidth={8}
                color="#6b38d4"
              >
                <span className="text-3xl font-black text-on-surface">{metrics.confidence}%</span>
              </CircularProgress>
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider mt-3">Avg Confidence Score</span>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-surface-container flex flex-col items-center justify-center space-y-2">
              <span className="material-symbols-outlined text-3xl text-secondary fill">insights</span>
              <h4 className="text-base font-extrabold text-on-surface">Speech Pacing Index</h4>
              <span className="px-3 py-1 bg-secondary/15 text-secondary text-xs font-extrabold rounded border border-secondary/20">
                {metrics.pacing} ({metrics.wpm} WPM)
              </span>
              <p className="text-[10px] text-on-surface-variant font-semibold">Perfect articulation speed index.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/interview')}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Simulation Active panel */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
          {/* Center Stage: AI Avatar & Chat timeline */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            {/* Avatar Stage */}
            <div className="flex-grow flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container relative overflow-hidden min-h-[160px] max-h-[220px]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-surface-container-low/40 to-transparent pointer-events-none"></div>

              {/* Orbiting geometric sphere */}
              <div className="w-24 h-24 rounded-full mb-3 relative bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center shadow-inner scale-90">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg ai-glow animate-pulse">
                  <span className="material-symbols-outlined text-2xl fill animate-spin" style={{ animationDuration: '8s' }}>
                    auto_awesome
                  </span>
                </div>
                <svg className="absolute inset-0 w-full h-full text-primary/30 animate-spin" style={{ animationDuration: '15s' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeDasharray="3 7" strokeWidth="0.75"></circle>
                </svg>
              </div>

              <div className="text-center max-w-xl z-10 space-y-1">
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Active Simulator Question</p>
                <h3 className="text-xs md:text-sm font-bold text-on-surface leading-relaxed max-h-[60px] overflow-y-auto">
                  "{questions[currentIdx]?.text}"
                </h3>
              </div>
            </div>

            {/* Conversational timeline */}
            <div className="h-72 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col overflow-hidden shrink-0">
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                      msg.sender === 'user' 
                        ? 'bg-primary-container text-on-primary-container'
                        : msg.avatar === 'insights'
                        ? 'bg-secondary-container text-on-secondary-container border border-secondary/20'
                        : 'bg-surface-container-high text-on-surface'
                    }`}>
                      <span className="material-symbols-outlined text-sm">{msg.avatar}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-primary/5 border border-primary/20 text-on-surface rounded-tr-none'
                        : msg.avatar === 'insights'
                        ? 'bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/25 text-on-surface rounded-tl-none font-medium'
                        : 'bg-surface-container-low border border-surface-container-high text-on-surface rounded-tl-none font-medium'
                    }`}>
                      {msg.text}
                      
                      {msg.feedback && (
                        <div className="mt-2.5 pt-2 border-t border-surface-container-highest flex flex-wrap gap-2 text-[9px] font-bold">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">Confidence: {msg.feedback.confidenceIndex}%</span>
                          <span className="px-2 py-0.5 bg-secondary/15 text-secondary rounded">Pacing: {msg.feedback.pacingRateText}</span>
                          <span className={`px-2 py-0.5 rounded ${msg.feedback.isSTARCompliant ? 'bg-primary/10 text-primary' : 'bg-outline-variant/20 text-outline'}`}>
                            {msg.feedback.isSTARCompliant ? 'STAR Structured ✓' : 'No STAR Pattern Detected'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {submitting && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1 p-3 bg-surface-container rounded-xl rounded-tl-none w-16 justify-center">
                        <div className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-[10px] text-outline font-bold">AI Coach is auditing speech structure...</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input area */}
              <form onSubmit={handleSubmitAnswer} className="p-3 bg-surface border-t border-surface-container-high flex gap-3 items-center shrink-0">
                <button
                  type="button"
                  onClick={handleMicSimulate}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm cursor-pointer ${
                    isMuted
                      ? 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                      : 'bg-primary text-on-primary hover:bg-primary/95 ai-glow'
                  }`}
                  title="Simulate Voice Input"
                >
                  <span className="material-symbols-outlined text-xl">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                </button>

                <input
                  type="text"
                  required
                  disabled={submitting || sessionFinished}
                  placeholder={submitting ? 'AI Coach is analyzing response...' : "Type your technical response here, or click the microphone to simulate your voice answer..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold text-on-surface focus:border-primary outline-none disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || submitting}
                  className="px-4 py-2.5 bg-surface-container text-primary font-extrabold text-xs hover:bg-surface-container-high rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-40"
                >
                  Submit Answer
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live coaching metrics */}
          <aside className="lg:col-span-4 flex flex-col gap-6 h-full shrink-0">
            {/* Live Metrics */}
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-container shadow-sm flex-grow">
              <h3 className="text-xs font-bold text-on-surface mb-4 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg">monitoring</span> Live Coaching Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="bg-surface p-3 rounded-lg border border-surface-variant/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-on-surface-variant font-medium">Confidence Index</span>
                    <span className="text-xs font-bold text-secondary">{metrics.confidence}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full transition-all duration-500" style={{ width: `${metrics.confidence}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface p-3 rounded-lg border border-surface-variant/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-on-surface-variant font-medium">Pacing Coefficient</span>
                    <span className="text-xs font-bold text-primary">{metrics.pacing}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 flex gap-1">
                    <div className={`h-1.5 rounded-full flex-1 transition-all ${metrics.wpm >= 90 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                    <div className={`h-1.5 rounded-full flex-1 transition-all ${metrics.wpm >= 115 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                    <div className={`h-1.5 rounded-full flex-1 transition-all ${metrics.wpm >= 135 ? 'bg-primary/45' : 'bg-primary/20'}`}></div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 font-medium font-mono">
                    Speed: ~{metrics.wpm} words/minute
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="bg-surface p-4 rounded-xl border border-surface-container space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Interview Progress</span>
                    <span className="text-xs font-extrabold text-on-surface">Question {currentIdx + 1} / 5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map(idx => (
                      <div 
                        key={idx} 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          idx < currentIdx 
                            ? 'bg-primary' 
                            : idx === currentIdx 
                            ? 'bg-secondary animate-pulse' 
                            : 'bg-surface-container-high'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Coach tips */}
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-2 items-start mt-2">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">insights</span>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
                    {feedbackHistory.length > 0 
                      ? feedbackHistory[feedbackHistory.length - 1].coachingTip 
                      : "Speak clearly and state concrete Situation-Task-Action-Result examples from your professional career to score highly."}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
