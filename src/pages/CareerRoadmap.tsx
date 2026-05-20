import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicRoadmap, Phase, DayLearnTask, ConceptDetails, MiniCheckpoint, PhaseProject } from '../utils/aiService';
import { useProfile } from '../context/ProfileContext';

// ─── TYPES ─────────────────────────────────────────────────────────
interface QuizAnswers {
  [questionIndex: number]: string;
}

// ═══════════════════════════════════════════════════════════════════
// CONCEPT ASSISTANT PANEL / DRAWER
// ═══════════════════════════════════════════════════════════════════
interface ConceptDrawerProps {
  concept: ConceptDetails;
  taskTitle: string;
  onClose: () => void;
  onMarkUnderstood: () => void;
}

const ConceptDrawer: React.FC<ConceptDrawerProps> = ({ concept, taskTitle, onClose, onMarkUnderstood }) => {
  const [simplifying, setSimplifying] = useState(false);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white/95 backdrop-blur-md border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-slide-in font-sans">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky-500">Learning Assistant</p>
            <h3 className="text-base font-black text-slate-800 leading-tight">{taskTitle}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Analogy Alert Box */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-sky-600 text-lg mt-0.5">lightbulb</span>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Concept Analogy</p>
            <p className="text-xs text-sky-950/80 italic leading-relaxed">
              "{concept.analogy}"
            </p>
          </div>
        </div>

        {/* What Is This */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            What is this?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {simplifying 
              ? `Simply put: Think of this like a building block. You define it once and reuse it everywhere to keep everything tidy and consistent.` 
              : concept.whatIsThis}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Why does it matter?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {concept.whyItMatters}
          </p>
        </div>

        {/* Where is it used */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Where is it used in production?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {concept.whereIsUsed}
          </p>
        </div>

        {/* Simple Example */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Example
            </h4>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed shadow-inner whitespace-pre-wrap">
            <code>
              {concept.simpleExample}
            </code>
          </pre>
        </div>

        {/* Mini Visualization */}
        {concept.miniVisualization && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              Visual Layout
            </h4>
            <pre className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono text-slate-600 leading-normal">
              {concept.miniVisualization}
            </pre>
          </div>
        )}

        {/* Related Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Related Concepts
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {concept.relatedConcepts.map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-[10px] font-bold transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Practice challenge */}
        <div className="bg-amber-50/60 border border-amber-100/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-600 text-sm">fitness_center</span>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Reinforcement Practice</p>
          </div>
          <p className="text-xs text-amber-950/80 leading-relaxed font-semibold">
            {concept.quickPractice}
          </p>
        </div>

      </div>

      {/* Footer controls */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
        <button
          onClick={() => setSimplifying(!simplifying)}
          className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5
            ${simplifying 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          <span className="material-symbols-outlined text-base">psychology_alt</span>
          {simplifying ? "Explain Normally" : "Explain Simpler"}
        </button>

        <button
          onClick={() => {
            onMarkUnderstood();
            onClose();
          }}
          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">check</span>
          Understood!
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// QUIZ CHECKPOINT BLOCK
// ═══════════════════════════════════════════════════════════════════
interface CheckpointBlockProps {
  checkpoint: MiniCheckpoint;
  isUnlocked: boolean;
  onPassed: () => void;
  saving: boolean;
}

const CheckpointBlock: React.FC<CheckpointBlockProps> = ({ checkpoint, isUnlocked, onPassed, saving }) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelect = (qIdx: number, val: string) => {
    if (submitted || checkpoint.passed) return;
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkpoint.passed) return;

    const totalQuestions = checkpoint.questions.length;
    let correctCount = 0;

    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === checkpoint.questions[i].correctAnswer) {
        correctCount++;
      }
    }

    setScore(correctCount);
    setSubmitted(true);

    if (correctCount === totalQuestions) {
      onPassed();
    } else {
      setErrorMsg(`You answered ${correctCount}/${totalQuestions} questions correctly. Retake the assessment to unlock the phase project!`);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setErrorMsg('');
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 relative
      ${checkpoint.passed
        ? 'bg-emerald-50/60 border-emerald-200/80 shadow-md shadow-emerald-100/20'
        : isUnlocked
          ? 'bg-white border-slate-200 hover:shadow-lg hover:shadow-slate-100/50'
          : 'bg-slate-50/40 border-slate-100 opacity-60'
      }
    `}>
      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${checkpoint.passed 
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-indigo-100 text-indigo-600'
          }
        `}>
          <span className="material-symbols-outlined text-lg">fact_check</span>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Mini Checkpoint</p>
          <h4 className="text-sm font-black text-slate-800">{checkpoint.title}</h4>
        </div>
        {checkpoint.passed && (
          <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">done_all</span> Passed
          </span>
        )}
      </div>

      {checkpoint.passed ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Excellent! You have successfully validated your concepts. The phase final project is now unlocked and available for implementation.
          </p>
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Concept Comprehensions Met:</p>
            <div className="space-y-1.5">
              {checkpoint.confidenceSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isUnlocked ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {checkpoint.questions.map((q, qIdx) => (
            <div key={qIdx} className="space-y-2">
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                {qIdx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === opt;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, opt)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer
                        ${isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs rounded-r-xl font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            {submitted && score < checkpoint.questions.length ? (
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Retake Assessment
              </button>
            ) : (
              <button
                type="submit"
                disabled={checkpoint.questions.some((_, i) => !answers[i]) || saving}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                Submit Answers
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="material-symbols-outlined text-base">lock</span>
          <span>Complete all daily learning modules to unlock this assessment checkpoint.</span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════
const XPBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
          }}
        />
      </div>
      <span className="text-xs font-extrabold text-slate-500 tabular-nums whitespace-nowrap">
        {current.toLocaleString()} / {total.toLocaleString()} XP
      </span>
    </div>
  );
};

interface DayCardProps {
  day: DayLearnTask;
  phaseUnlocked: boolean;
  onComplete: () => void;
  onCheckConcept: () => void;
  saving: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, phaseUnlocked, onComplete, onCheckConcept, saving }) => {
  const isLocked = day.status === 'Locked' || !phaseUnlocked;
  const isCompleted = day.status === 'Completed';
  const isAvailable = !isLocked && !isCompleted;
  
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 relative group
      ${isCompleted 
        ? 'bg-emerald-50/50 border-emerald-200/50 opacity-90'
        : isLocked
          ? 'bg-slate-50/40 border-slate-100/80 opacity-50'
          : day.type === 'LEARN'
            ? 'bg-sky-50/60 border-sky-200/60 hover:shadow-lg hover:shadow-sky-100/30'
            : 'bg-amber-50/50 border-amber-200/50 hover:shadow-lg hover:shadow-amber-100/30'
      }
    `}>
      {/* Top Header Badge Row */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
          ${day.type === 'LEARN'
            ? 'bg-sky-100 text-sky-700'
            : 'bg-amber-100 text-amber-700'
          }
        `}>
          {day.type === 'LEARN' ? 'Concept Learning' : 'Practice Drill'}
        </span>
        <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-indigo-50 text-indigo-600">
          +{day.xpReward} XP
        </span>
        <span className="text-[10px] font-bold text-slate-400 ml-auto flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          {day.timeEstimate}
        </span>
      </div>

      {/* Title & Description */}
      <h4 className={`text-sm font-black mb-1 leading-snug
        ${isCompleted ? 'text-emerald-800 line-through decoration-emerald-300' : isLocked ? 'text-slate-400' : 'text-slate-800'}
      `}>
        Day {day.dayNumber}: {day.title}
      </h4>
      <p className={`text-xs leading-relaxed mb-4
        ${isCompleted ? 'text-emerald-600/70' : isLocked ? 'text-slate-300' : 'text-slate-500'}
      `}>
        {day.description}
      </p>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {day.concept && !isLocked && (
            <button
              onClick={onCheckConcept}
              className="px-3.5 py-1.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">psychology</span>
              Check Concept
            </button>
          )}
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1 text-emerald-600">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span className="text-[10px] font-extrabold uppercase">Learned</span>
          </div>
        ) : isAvailable ? (
          <button
            onClick={onComplete}
            disabled={saving}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-extrabold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100/50 cursor-pointer disabled:opacity-50"
          >
            Mark Complete
          </button>
        ) : (
          <div className="flex items-center gap-1 text-slate-300">
            <span className="material-symbols-outlined text-base">lock</span>
            <span className="text-[10px] font-extrabold uppercase">Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface PhaseBlockProps {
  phase: Phase;
  index: number;
  isActive: boolean;
  isUnlocked: boolean;
  onDayComplete: (dayId: string) => void;
  onCheckpointPassed: () => void;
  onProjectComplete: () => void;
  onOpenConcept: (taskTitle: string, concept: ConceptDetails) => void;
  saving: boolean;
}

const PhaseBlock: React.FC<PhaseBlockProps> = ({
  phase,
  index,
  isActive,
  isUnlocked,
  onDayComplete,
  onCheckpointPassed,
  onProjectComplete,
  onOpenConcept,
  saving,
}) => {
  const [expanded, setExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive) setExpanded(true);
  }, [isActive]);

  const totalTasks = phase.days.length + 1; // days + project
  let completedCount = phase.days.filter(d => d.status === 'Completed').length;
  if (phase.finalProject.status === 'Completed') completedCount++;

  const pct = Math.round((completedCount / totalTasks) * 100);
  const isPhaseCompleted = completedCount === totalTasks;

  // Check if checkpoint is unlocked (all days completed)
  const isCheckpointUnlocked = isUnlocked && phase.days.every(d => d.status === 'Completed');
  // Check if project is unlocked (checkpoint passed)
  const isProjectUnlocked = isUnlocked && phase.checkpoint.passed;

  return (
    <div className="relative">
      {/* Vertical line between phases */}
      {index > 0 && (
        <div className="absolute left-8 -top-8 w-0.5 h-8" style={{
          background: isUnlocked
            ? 'linear-gradient(to bottom, #a78bfa, #6366f1)'
            : '#e2e8f0',
        }} />
      )}

      {/* Header card */}
      <div
        onClick={() => isUnlocked && setExpanded(!expanded)}
        className={`flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300
          ${isPhaseCompleted
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-200/60 cursor-pointer shadow-sm'
            : isActive
              ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/30 cursor-pointer ring-1 ring-indigo-50'
              : isUnlocked
                ? 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md cursor-pointer'
                : 'bg-slate-50/50 border-slate-100 opacity-60'
          }
        `}
      >
        {/* Circle index */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-lg transition-all
          ${isPhaseCompleted
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
            : isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : isUnlocked
                ? 'bg-slate-200 text-slate-600'
                : 'bg-slate-100 text-slate-300'
          }
        `}>
          {isPhaseCompleted ? (
            <span className="material-symbols-outlined text-xl">check</span>
          ) : (
            index + 1
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-0.5
                ${isPhaseCompleted ? 'text-emerald-500' : isActive ? 'text-indigo-500' : 'text-slate-400'}`}
              >
                {phase.duration} · {phase.focus}
              </p>
              <h3 className={`text-base font-black leading-tight
                ${isPhaseCompleted ? 'text-emerald-800' : isActive ? 'text-slate-900' : isUnlocked ? 'text-slate-700' : 'text-slate-400'}`}
              >
                {phase.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold
                ${isPhaseCompleted ? 'bg-emerald-100 text-emerald-700' : isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}
              >
                +{phase.xpReward} XP
              </span>
              {isUnlocked && (
                <span className={`material-symbols-outlined text-lg transition-transform ${expanded ? 'rotate-180' : ''} ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                  expand_more
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: isPhaseCompleted
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                }}
              />
            </div>
            <span className={`text-[10px] font-extrabold tabular-nums ${isPhaseCompleted ? 'text-emerald-600' : isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              {completedCount}/{totalTasks}
            </span>
          </div>

          {/* Skills badge */}
          {phase.unlockedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {phase.unlockedSkills.map((skill, i) => (
                <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase
                  ${isPhaseCompleted ? 'bg-emerald-100/60 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded syllabus sequence */}
      {expanded && isUnlocked && (
        <div className="mt-4 ml-6 pl-4 border-l border-dashed border-slate-200/80 space-y-4 animate-fade-in">
          {/* Days */}
          {phase.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              phaseUnlocked={isUnlocked}
              onComplete={() => onDayComplete(day.id)}
              onCheckConcept={() => day.concept && onOpenConcept(day.title, day.concept)}
              saving={saving}
            />
          ))}

          {/* Checkpoint block */}
          <CheckpointBlock
            checkpoint={phase.checkpoint}
            isUnlocked={isCheckpointUnlocked}
            onPassed={onCheckpointPassed}
            saving={saving}
          />

          {/* Phase Project */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 relative
            ${phase.finalProject.status === 'Completed'
              ? 'bg-emerald-50/50 border-emerald-200/50'
              : isProjectUnlocked
                ? 'bg-violet-50/80 border-violet-200/80 hover:shadow-lg hover:shadow-violet-100/30'
                : 'bg-slate-50/40 border-slate-100 opacity-50'
            }
          `}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider
                ${phase.finalProject.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-violet-100 text-violet-700'
                }
              `}>
                Phase Project
              </span>
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-indigo-50 text-indigo-600">
                +{phase.finalProject.xpReward} XP
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-auto flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                {phase.finalProject.timeEstimate}
              </span>
            </div>

            <h4 className={`text-sm font-black mb-1 leading-snug
              ${phase.finalProject.status === 'Completed' ? 'text-emerald-800 line-through decoration-emerald-300' : isProjectUnlocked ? 'text-violet-950' : 'text-slate-400'}
            `}>
              BUILD: {phase.finalProject.title}
            </h4>
            <p className={`text-xs leading-relaxed mb-3
              ${phase.finalProject.status === 'Completed' ? 'text-emerald-600/70' : isProjectUnlocked ? 'text-violet-850/80' : 'text-slate-300'}
            `}>
              {phase.finalProject.description}
            </p>

            {isProjectUnlocked && (
              <div className="space-y-2 mb-4 p-3 bg-violet-100/40 border border-violet-200/40 rounded-xl">
                <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Project Value Highlights:</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-violet-900">
                  <div>Impact: {phase.finalProject.hiringImpact}</div>
                  <div>Portfolio: {phase.finalProject.portfolioValue}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              {phase.finalProject.status === 'Completed' ? (
                <div className="flex items-center gap-1 text-emerald-600">
                  <span className="material-symbols-outlined text-base">emoji_events</span>
                  <span className="text-[10px] font-extrabold uppercase">Project Complete</span>
                </div>
              ) : isProjectUnlocked ? (
                <button
                  onClick={onProjectComplete}
                  disabled={saving}
                  className="px-4 py-1.5 bg-violet-600 text-white rounded-lg text-[10px] font-extrabold hover:bg-violet-700 transition-all shadow-md shadow-violet-100/50 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xs">rocket_launch</span>
                  Deploy Portfolio Project
                </button>
              ) : (
                <div className="flex items-center gap-1 text-slate-300">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span className="text-[10px] font-extrabold uppercase">Locked</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN GUIDED LEARNING EXPERIENCE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function CareerRoadmap() {
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useProfile();
  const raw = profile?.roadmap as DynamicRoadmap | null;
  const [saving, setSaving] = useState(false);

  // Concept assistant drawer drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerConcept, setDrawerConcept] = useState<ConceptDetails | null>(null);

  const hasRoadmap = raw && Array.isArray(raw.phases) && raw.phases.length > 0 && Array.isArray(raw.phases[0].days);

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-semibold">Accessing learning registry...</p>
        </div>
      </div>
    );
  }

  // ─── Redirect State if Empty ───
  if (!hasRoadmap) {
    return (
      <div className="max-w-lg mx-auto my-16 text-center p-10 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/50 animate-fade-in space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200/50">
          <span className="material-symbols-outlined text-4xl text-white">school</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Initialize Guided Pathway</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Our AI engine will layout a day-by-day learning syllabus tailored to your career transition.
          </p>
        </div>
        <button
          onClick={() => navigate('/roadmap/generator')}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          Generate Guided Journey
        </button>
      </div>
    );
  }

  // ─── Calculations ───
  const phases: Phase[] = raw.phases!;
  const totalXP = raw.totalXP || 0;
  
  // Max XP calculation (sum of all days xp + project xp + phase completions)
  let maxXP = 0;
  phases.forEach(p => {
    maxXP += p.xpReward;
    p.days.forEach(d => { maxXP += d.xpReward; });
    maxXP += p.finalProject.xpReward;
  });

  // Calculate global completion percentage
  let totalTasks = 0;
  let completedTasks = 0;
  phases.forEach(p => {
    p.days.forEach(d => {
      totalTasks++;
      if (d.status === 'Completed') completedTasks++;
    });
    totalTasks++; // checkpoint/final project
    if (p.finalProject.status === 'Completed') completedTasks++;
  });
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determine active phase
  const activePhaseIndex = phases.findIndex(p => {
    const allDaysDone = p.days.every(d => d.status === 'Completed');
    const projectDone = p.finalProject.status === 'Completed';
    return !allDaysDone || !p.checkpoint.passed || !projectDone;
  });

  // Recommended next task selection
  let nextTaskTitle = '';
  for (const p of phases) {
    const nextDay = p.days.find(d => d.status === 'Available');
    if (nextDay) {
      nextTaskTitle = nextDay.title;
      break;
    }
    if (p.days.every(d => d.status === 'Completed') && !p.checkpoint.passed) {
      nextTaskTitle = `Complete Checkpoint quiz for ${p.title}`;
      break;
    }
    if (p.checkpoint.passed && p.finalProject.status === 'Available') {
      nextTaskTitle = `Build Project: ${p.finalProject.title}`;
      break;
    }
  }

  // ─── Actions handlers ───
  const handleOpenConcept = (title: string, concept: ConceptDetails) => {
    setDrawerTitle(title);
    setDrawerConcept(concept);
    setDrawerOpen(true);
  };

  const handleDayComplete = async (dayId: string) => {
    if (!raw || saving) return;
    setSaving(true);

    let xpAdded = 0;
    const updatedPhases = phases.map(phase => {
      // Find and update the day
      const updatedDays = phase.days.map(day => {
        if (day.id === dayId && day.status !== 'Locked') {
          xpAdded = day.xpReward;
          return { ...day, status: 'Completed' as const };
        }
        return day;
      });

      // Unlock subsequent day in the same phase if there is one
      const targetIdx = updatedDays.findIndex(d => d.id === dayId);
      if (targetIdx !== -1 && targetIdx < updatedDays.length - 1) {
        if (updatedDays[targetIdx].status === 'Completed' && updatedDays[targetIdx + 1].status === 'Locked') {
          updatedDays[targetIdx + 1] = { ...updatedDays[targetIdx + 1], status: 'Available' as const };
        }
      }

      return { ...phase, days: updatedDays };
    });

    const updatedRoadmap = {
      ...raw,
      phases: updatedPhases,
      totalXP: totalXP + xpAdded,
    };

    try {
      await updateProfile({ roadmap: updatedRoadmap });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckpointPassed = async (phaseId: string) => {
    if (!raw || saving) return;
    setSaving(true);

    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          checkpoint: { ...phase.checkpoint, passed: true },
          finalProject: { ...phase.finalProject, status: 'Available' as const },
        };
      }
      return phase;
    });

    const updatedRoadmap = {
      ...raw,
      phases: updatedPhases,
    };

    try {
      await updateProfile({ roadmap: updatedRoadmap });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleProjectComplete = async (phaseId: string) => {
    if (!raw || saving) return;
    setSaving(true);

    let xpAdded = 0;
    let unlockedNext = false;
    const phaseIndex = phases.findIndex(p => p.id === phaseId);

    const updatedPhases = phases.map((phase, idx) => {
      if (phase.id === phaseId) {
        xpAdded = phase.finalProject.xpReward + phase.xpReward; // project xp + phase completion xp
        return {
          ...phase,
          finalProject: { ...phase.finalProject, status: 'Completed' as const },
          completionPercentage: 100,
        };
      }
      return phase;
    });

    // Unlock day 1 of the NEXT phase
    if (phaseIndex !== -1 && phaseIndex < updatedPhases.length - 1) {
      const nextPhase = updatedPhases[phaseIndex + 1];
      if (nextPhase.days.length > 0 && nextPhase.days[0].status === 'Locked') {
        nextPhase.days[0] = { ...nextPhase.days[0], status: 'Available' as const };
      }
    }

    const updatedRoadmap = {
      ...raw,
      phases: updatedPhases,
      totalXP: totalXP + xpAdded,
    };

    try {
      await updateProfile({ roadmap: updatedRoadmap });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 font-sans relative">
      
      {/* ── Header details ── */}
      <div className="mb-8 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-500">
            Guided Transition Journey
          </p>
          <button
            onClick={() => navigate('/roadmap/generator')}
            className="text-[10px] font-extrabold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Re-generate path
          </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
          {raw.targetRole}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {raw.description}
        </p>

        {/* Global journey XP status bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-slate-900">{overallPct}%</p>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Transformation Pace</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-indigo-600">{totalXP.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Global XP</p>
            </div>
          </div>
          <XPBar current={totalXP} total={maxXP} />
          <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              {completedTasks} Complete
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              {totalTasks - completedTasks} Remaining
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <span className="material-symbols-outlined text-xs">layers</span>
              {phases.length} Phases
            </span>
          </div>
        </div>
      </div>

      {/* ── AI Learning Assistant guidance callout ── */}
      {nextTaskTitle && (
        <div className="mb-8 bg-gradient-to-r from-sky-50/60 to-indigo-50/40 border border-sky-100/80 rounded-2xl p-4 flex items-start gap-3 shadow-sm shadow-indigo-100/10">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 text-sky-600">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <div>
            <p className="text-[9px] font-extrabold text-sky-600 uppercase tracking-widest mb-0.5">Your Active Focus</p>
            <p className="text-xs text-slate-700 font-bold leading-normal">{nextTaskTitle}</p>
          </div>
        </div>
      )}

      {/* ── Syllabus Sequence Path ── */}
      <div className="space-y-8">
        {phases.map((phase, idx) => {
          const isActive = idx === activePhaseIndex;
          const isUnlocked = idx === 0 || phases[idx - 1].finalProject.status === 'Completed';

          return (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              index={idx}
              isActive={isActive}
              isUnlocked={isUnlocked}
              onDayComplete={(dayId) => handleDayComplete(dayId)}
              onCheckpointPassed={() => handleCheckpointPassed(phase.id)}
              onProjectComplete={() => handleProjectComplete(phase.id)}
              onOpenConcept={handleOpenConcept}
              saving={saving}
            />
          );
        })}
      </div>

      {/* ── Concept Assistant Panel Drawer ── */}
      {drawerOpen && drawerConcept && (
        <ConceptDrawer
          concept={drawerConcept}
          taskTitle={drawerTitle}
          onClose={() => setDrawerOpen(false)}
          onMarkUnderstood={() => {
            // Understood action (can reward extra 10 XP as small reinforcement micro-incentive)
            console.log("Concept understood");
          }}
        />
      )}

      {/* ── Journey Complete State ── */}
      {overallPct === 100 && (
        <div className="mt-12 text-center space-y-4 animate-fade-in p-8 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 border border-emerald-100 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50 text-white">
            <span className="material-symbols-outlined text-3xl">emoji_events</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Career Evolution Achieved!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You've completed all guided phases, exercises, and custom projects. You're fully ready to transition into a {raw.targetRole}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/resume')}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 cursor-pointer"
            >
              Analyze Resume
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Practice Interview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
