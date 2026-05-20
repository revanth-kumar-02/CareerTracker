import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TermsModal from '../components/legal/TermsModal';
import PrivacyModal from '../components/legal/PrivacyModal';
import logo from '../assets/logo.svg';
import logoWhite from '../assets/logo-white.svg';
import icon from '../assets/icon.svg';

// ── Animated role badge data ───────────────────────────────────────────────
const ROLES = [
  'Frontend Developer',
  'AI/ML Engineer',
  'UX Designer',
  'DevOps Engineer',
  'Data Scientist',
  'Full Stack Developer',
  'Cloud Architect',
  'Cybersecurity Analyst',
];

const FEATURES = [
  { icon: 'route', label: 'AI Career Roadmap', desc: 'Personalized multi-phase learning paths' },
  { icon: 'record_voice_over', label: 'Interview Simulator', desc: 'AI-powered mock interview coaching' },
  { icon: 'description', label: 'Resume Lab', desc: 'ATS optimization & expert feedback' },
  { icon: 'school', label: 'Daily Learning', desc: 'Streak-based skill development system' },
  { icon: 'insights', label: 'Skill Tracking', desc: 'Visual progress across core competencies' },
];

// ── Toast notification component ──────────────────────────────────────────
interface ToastProps {
  key?: string;
  message: string;
  type: 'error' | 'success' | 'info';
  onDismiss: () => void;
}

function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
    info: 'bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30',
  };
  const icons = { error: 'error', success: 'check_circle', info: 'info' };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl text-sm font-semibold max-w-sm ${colors[type]}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </motion.div>
  );
}

// ── Left branding panel ────────────────────────────────────────────────────
function BrandingPanel({ isDark }: { isDark: boolean }) {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-14 relative overflow-hidden select-none">
      {/* Gradient blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(70,72,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(70,72,212,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <img src={isDark ? logoWhite : logo} className="h-9 w-auto" alt="CareerTrack AI Logo" />
      </div>

      {/* Hero text + animated role */}
      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] text-primary font-extrabold uppercase tracking-[0.2em]">Your Career Engine</p>
          <h1 className="text-3xl xl:text-[36px] font-black text-on-surface leading-tight tracking-tight">
            Navigate your path to
            <br />
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-gradient inline-block"
              >
                {ROLES[roleIdx]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-xs">
            AI-powered career coaching that adapts to your goals, skills, and pace — from day one to dream job.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4, ease: 'easeOut' }}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>{f.icon}</span>
              </div>
              <div>
                <p className="text-[12px] font-black text-on-surface leading-tight">{f.label}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Animated input field ───────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  icon?: string;
  rightSlot?: React.ReactNode;
}

function InputField({ id, label, type, value, onChange, placeholder, required, autoComplete, error, icon, rightSlot }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
        {label}
      </label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
        error
          ? 'border-red-400 bg-red-50/40 dark:bg-red-950/20'
          : focused
          ? 'border-primary bg-surface ring-2 ring-primary/10'
          : 'border-outline-variant/40 bg-surface hover:border-outline-variant'
      }`}>
        {icon && (
          <span className="material-symbols-outlined text-on-surface-variant/50 ml-3.5 flex-shrink-0" style={{ fontSize: '17px' }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 outline-none ${icon ? 'pl-2' : 'pl-3.5'}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-red-500 font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>error</span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Google auth button ─────────────────────────────────────────────────────
function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface hover:bg-surface-container hover:border-outline-variant transition-all duration-200 text-sm font-semibold text-on-surface cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow"
    >
      {/* Google icon SVG */}
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
      Continue with Google
    </button>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────────
interface LoginFormProps {
  key?: string;
  onSwitch: () => void;
  setToast: (t: { message: string; type: 'error' | 'success' | 'info' } | null) => void;
}

function LoginForm({ onSwitch, setToast }: LoginFormProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      const msg = error.message.includes('Invalid login') || error.message.includes('credentials')
        ? 'Incorrect email or password. Please try again.'
        : error.message;
      setToast({ message: msg, type: 'error' });
    } else {
      setToast({ message: 'Welcome back! Loading your workspace…', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 800);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setToast({ message: error.message, type: 'error' });
      setGoogleLoading(false);
    }
    // On success, Supabase redirects — no need to handle here
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Welcome back</h2>
        <p className="text-sm text-on-surface-variant font-medium">Continue building your career journey</p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-surface-container-high" />
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">or with email</span>
        <div className="flex-1 h-px bg-surface-container-high" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <InputField
          id="login-email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          icon="mail"
          error={errors.email}
        />

        <InputField
          id="login-password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Your password"
          autoComplete="current-password"
          icon="lock"
          error={errors.password}
          rightSlot={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(v => !v)}
              className="p-2 mr-1 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors cursor-pointer"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                {showPw ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-outline-variant/40 text-primary accent-primary cursor-pointer" />
            <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
          </label>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            onClick={() => setToast({ message: 'Password reset emails are sent via your Supabase dashboard.', type: 'info' })}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/60 text-on-primary rounded-xl text-sm font-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              Continue Your Journey
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[12px] text-on-surface-variant font-medium">
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-primary font-bold hover:underline cursor-pointer">
          Create one free
        </button>
      </p>
    </motion.div>
  );
}

// ── Signup Form ────────────────────────────────────────────────────────────
interface SignupFormProps {
  key?: string;
  onSwitch: () => void;
  setToast: (t: { message: string; type: 'error' | 'success' | 'info' } | null) => void;
}

function SignupForm({ onSwitch, setToast }: SignupFormProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!confirmPw) e.confirmPw = 'Please confirm your password';
    else if (confirmPw !== password) e.confirmPw = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(email, password, fullName.trim());
    setLoading(false);
    if (error) {
      const msg = error.message.includes('already registered')
        ? 'This email is already registered. Try logging in instead.'
        : error.message;
      setToast({ message: msg, type: 'error' });
    } else {
      setToast({ message: 'Account created! Redirecting to your dashboard…', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setToast({ message: error.message, type: 'error' });
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="space-y-3.5"
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Start your journey</h2>
        <p className="text-sm text-on-surface-variant font-medium">Create your free CareerTrack AI account</p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-surface-container-high" />
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">or with email</span>
        <div className="flex-1 h-px bg-surface-container-high" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <InputField
          id="signup-name"
          label="Full name"
          type="text"
          value={fullName}
          onChange={setFullName}
          placeholder="e.g. Alex Rivera"
          autoComplete="name"
          icon="person"
          error={errors.fullName}
        />

        <InputField
          id="signup-email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          icon="mail"
          error={errors.email}
        />

        <InputField
          id="signup-password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon="lock"
          error={errors.password}
          rightSlot={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(v => !v)}
              className="p-2 mr-1 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors cursor-pointer"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                {showPw ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />

        <InputField
          id="signup-confirm-password"
          label="Confirm password"
          type={showPw ? 'text' : 'password'}
          value={confirmPw}
          onChange={setConfirmPw}
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon="lock_check"
          error={errors.confirmPw}
        />

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => {
                const strength = password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      i <= strength
                        ? strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-orange-400' : strength === 3 ? 'bg-yellow-400' : 'bg-emerald-500'
                        : 'bg-surface-container-high'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-on-surface-variant font-medium">
              {password.length < 6 ? 'Too short' : password.length < 8 ? 'Getting there' : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'Strong password ✓' : 'Add numbers & uppercase for stronger password'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/60 text-on-primary rounded-xl text-sm font-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-1.5"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rocket_launch</span>
              Start My Career Journey
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[11px] text-on-surface-variant/60 font-semibold leading-relaxed">
        By signing up you agree to our{' '}
        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="text-primary cursor-pointer hover:underline bg-transparent border-0 p-0 font-bold"
        >
          Terms of Service
        </button>{' '}
        and{' '}
        <button
          type="button"
          onClick={() => setShowPrivacy(true)}
          className="text-primary cursor-pointer hover:underline bg-transparent border-0 p-0 font-bold"
        >
          Privacy Policy
        </button>
      </p>

      <p className="text-center text-[12px] text-on-surface-variant font-medium">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-primary font-bold hover:underline cursor-pointer">
          Sign in
        </button>
      </p>

      <AnimatePresence>
        {showTerms && <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />}
        {showPrivacy && <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Auth Page ─────────────────────────────────────────────────────────
export default function Auth() {
  const { session, authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // If already authenticated, skip to dashboard
  useEffect(() => {
    if (!authLoading && session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center p-3 animate-pulse mx-auto shadow-sm">
            <img src={icon} className="w-full h-full object-contain animate-spin-slow" style={{ animationDuration: '6s' }} alt="Checking session..." />
          </div>
          <p className="text-xs text-on-surface-variant font-bold">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[55%] bg-surface-container-lowest border-r border-surface-container">
        <BrandingPanel isDark={isDark} />
      </div>

      {/* ── Right: Auth Card ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center px-6 pt-6 pb-2">
          <img src={isDark ? logoWhite : logo} className="h-8 w-auto" alt="CareerTrack AI" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-[420px]"
          >
            {/* Tab toggle */}
            <div className="flex bg-surface-container rounded-xl p-1 mb-4 border border-surface-container-high gap-1">
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    mode === m
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Form switcher */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <LoginForm key="login" onSwitch={() => setMode('signup')} setToast={setToast} />
              ) : (
                <SignupForm key="signup" onSwitch={() => setMode('login')} setToast={setToast} />
              )}
            </AnimatePresence>

            {/* Footer */}
            <p className="text-center text-[10px] text-on-surface-variant/40 font-medium mt-5">
              © 2026 CareerTrack AI · All rights reserved to S Mercina Gifty
            </p>
          </motion.div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
