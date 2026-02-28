import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { AUTH_ENDPOINTS } from '@/config/api';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  BriefcaseBusiness, User, Building2, ChevronDown,
} from 'lucide-react';

/* ─── Shared input ─── */
function AuthInput({ icon: Icon, label, error, className = '', ...props }) {
  return (
    <div className="group">
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-indigo-500 transition-colors" />}
        <input
          {...props}
          className={`w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 hover:border-gray-300 ${Icon ? 'pl-11' : 'pl-4'} pr-4 ${className}`}
        />
      </div>
      {error && <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Social Buttons ─── */
function SocialButtons() {
  return (
    <div className="flex items-center justify-center gap-3">
      <button type="button" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 active:scale-95">
        <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      </button>
      <button type="button" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-0.5 active:scale-95">
        <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </button>
      <button type="button" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 active:scale-95">
        <svg className="h-[18px] w-[18px] text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button type="button" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-0.5 active:scale-95">
        <svg className="h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </button>
    </div>
  );
}

function Spinner() {
  return <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;
}

/* ═══════════════════════════════════════════════════ */
/*  AUTH PAGE — Smooth cross-fade between forms       */
/* ═══════════════════════════════════════════════════ */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === '/register';
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);

  useEffect(() => { setIsSignUp(location.pathname === '/register'); }, [location.pathname]);

  /* ── Login state ── */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  /* ── Register state ── */
  const [regForm, setRegForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', campus: '', role: 'student', studentMode: 'freelancer' });
  const [regErrors, setRegErrors] = useState({});
  const [showRegPw, setShowRegPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleRegChange = (e) => {
    setRegForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setRegErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const toggleMode = useCallback((goToSignUp) => {
    setIsSignUp(goToSignUp);
    window.history.replaceState(null, '', goToSignUp ? '/register' : '/login');
  }, []);

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed. Please try again.');
      localStorage.setItem('sb_token', data.token);
      login(data.user);
      if (data.user.type === 'admin') navigate('/admin');
      else if (data.user.type === 'campus') navigate('/campus');
      else navigate('/student');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  /* ── Register ── */
  const [regApiError, setRegApiError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegApiError('');
    const errs = {};
    if (!regForm.fullName.trim()) errs.fullName = 'Required';
    if (!regForm.email.trim()) errs.email = 'Required';
    if (regForm.password.length < 6) errs.password = 'Min 6 chars';
    if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = "Don't match";
    if (!regForm.campus.trim()) errs.campus = 'Required';
    setRegErrors(errs);
    if (Object.keys(errs).length) return;
    setRegLoading(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regForm.fullName.trim(),
          email: regForm.email.trim(),
          password: regForm.password,
          campus: regForm.campus.trim(),
          role: regForm.role,
          studentMode: regForm.studentMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed. Please try again.');
      setRegSuccess(true);
    } catch (err) {
      setRegApiError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  /* CSS helper for form transitions */
  const formIn = 'opacity-100 translate-y-0 scale-100 pointer-events-auto';
  const formOut = 'opacity-0 translate-y-6 scale-[0.97] pointer-events-none absolute inset-0';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-4 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      {/* ═══ MAIN CARD ═══ */}
      <div className="relative w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 grid grid-cols-1 lg:grid-cols-2 bg-white">

        {/* ─── LEFT: Gradient panel (always fixed here) ─── */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700" />

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/[0.07]" />
          <div className="absolute bottom-16 left-12 h-44 w-44 rounded-full bg-white/[0.05]" />
          <div className="absolute top-1/3 right-16 h-28 w-28 rounded-full bg-white/[0.06]" />
          <div className="absolute bottom-1/3 -right-6 h-36 w-36 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/[0.03]" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg shadow-black/10">
              <BriefcaseBusiness className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SkillBridge</span>
          </div>

          {/* Center CTA — smooth cross-fade */}
          <div className="relative z-10 max-w-xs">
            {/* "New here?" — shown when login is active */}
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${!isSignUp ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute inset-0'}`}>
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">New here?</h2>
              <p className="mt-4 text-base text-indigo-100/90 leading-relaxed">Join us today and discover a world of possibilities. Create your account in seconds!</p>
              <button onClick={() => toggleMode(true)} className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-indigo-700 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:scale-95">
                Sign Up <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* "Welcome back!" — shown when signup is active */}
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSignUp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'}`}>
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">Welcome back!</h2>
              <p className="mt-4 text-base text-indigo-100/90 leading-relaxed">Already have an account? Sign in and continue where you left off.</p>
              <button onClick={() => toggleMode(false)} className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-indigo-700 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:scale-95">
                <ArrowLeft className="h-4 w-4" /> Sign In
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-8">
            <div><p className="text-2xl font-bold text-white">50+</p><p className="text-xs text-indigo-200/70">Campuses</p></div>
            <div><p className="text-2xl font-bold text-white">10K+</p><p className="text-xs text-indigo-200/70">Students</p></div>
            <div><p className="text-2xl font-bold text-white">5K+</p><p className="text-xs text-indigo-200/70">Gigs Posted</p></div>
          </div>
        </div>

        {/* ─── RIGHT: Form area (both forms stacked) ─── */}
        <div className="relative min-h-[620px] flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 overflow-hidden order-first lg:order-last">
          {/* ── Sign In ── */}
          <div className={`w-full max-w-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${!isSignUp ? formIn : formOut}`}>
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200"><BriefcaseBusiness className="h-5 w-5 text-white" /></div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SkillBridge</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Sign in</h2>
            <p className="mt-1.5 text-sm text-gray-500">Welcome back — let's get you in.</p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <AuthInput icon={Mail} label="Email" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@university.edu" />

              <div className="group">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type={showLoginPw ? 'text' : 'password'} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 hover:border-gray-300" />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                    {showLoginPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span className="text-xs text-gray-500">Remember me</span></label>
                <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</Link>
              </div>

              {loginError && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-600">{loginError}</p>
              )}

              <button type="submit" disabled={loginLoading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {loginLoading ? <span className="flex items-center justify-center gap-2"><Spinner /> Signing in...</span> : 'Login'}
              </button>
            </form>

            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-gray-400 font-medium">Or sign in with</span></div></div>
            <SocialButtons />

            <p className="mt-6 text-center text-sm text-gray-500 lg:hidden">Don&apos;t have an account?{' '}<button onClick={() => toggleMode(true)} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Create account</button></p>
          </div>

          {/* ── Sign Up ── */}
          <div className={`w-full max-w-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSignUp ? formIn : formOut}`}>
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200"><BriefcaseBusiness className="h-5 w-5 text-white" /></div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SkillBridge</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Create account</h2>
            <p className="mt-1.5 text-sm text-gray-500">Join the SkillBridge community.</p>

            {regSuccess ? (
              <div className="mt-8 flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Account Created!</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">Your request has been submitted. An admin will verify your account — you&apos;ll be able to log in once approved.</p>
                </div>
                <button
                  onClick={() => { setRegSuccess(false); toggleMode(false); }}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </button>
              </div>
            ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-3">
              <AuthInput icon={User} label="Full Name" name="fullName" required value={regForm.fullName} onChange={handleRegChange} placeholder="Jane Doe" error={regErrors.fullName} />
              <AuthInput icon={Mail} label="Email" name="email" type="email" required value={regForm.email} onChange={handleRegChange} placeholder="you@university.edu" error={regErrors.email} />

              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Password</label>
                  <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-indigo-500 transition-colors" /><input type={showRegPw ? 'text' : 'password'} name="password" required value={regForm.password} onChange={handleRegChange} placeholder="Min 6 chars" className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 hover:border-gray-300" /></div>
                  {regErrors.password && <p className="mt-1 ml-1 text-xs text-red-500">{regErrors.password}</p>}
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Confirm</label>
                  <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-indigo-500 transition-colors" /><input type={showRegPw ? 'text' : 'password'} name="confirmPassword" required value={regForm.confirmPassword} onChange={handleRegChange} placeholder="Re-enter" className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 hover:border-gray-300" /></div>
                  {regErrors.confirmPassword && <p className="mt-1 ml-1 text-xs text-red-500">{regErrors.confirmPassword}</p>}
                </div>
              </div>

              <AuthInput icon={Building2} label="Campus / Institution" name="campus" required value={regForm.campus} onChange={handleRegChange} placeholder="e.g. MIT, Stanford" error={regErrors.campus} />

              <div className="group">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">I am registering as</label>
                <div className="relative">
                  <select name="role" value={regForm.role} onChange={handleRegChange} className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50/80 py-3 pl-4 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 hover:border-gray-300 cursor-pointer"><option value="student">Student</option><option value="campus">Campus Authority</option></select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {regForm.role === 'student' && (
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: 'freelancer', label: 'Freelancer' }, { value: 'recruiter', label: 'Recruiter' }, { value: 'both', label: 'Both' }].map((opt) => (
                    <label key={opt.value} className={`flex items-center justify-center rounded-xl border px-3 py-2.5 text-xs font-medium cursor-pointer transition-all duration-200 ${regForm.studentMode === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="studentMode" value={opt.value} checked={regForm.studentMode === opt.value} onChange={handleRegChange} className="sr-only" />{opt.label}
                    </label>
                  ))}
                </div>
              )}

              {regApiError && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-600">{regApiError}</p>
              )}

              <button type="submit" disabled={regLoading} className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {regLoading ? <span className="flex items-center justify-center gap-2"><Spinner /> Creating account...</span> : 'Create Account'}
              </button>
            </form>
            )}

            {!regSuccess && (
              <>
                <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-gray-400 font-medium">Or sign up with</span></div></div>
                <SocialButtons />
                <p className="mt-5 text-center text-sm text-gray-500 lg:hidden">Already have an account?{' '}<button onClick={() => toggleMode(false)} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</button></p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
