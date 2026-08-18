import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { loginApi, registerApi } from '../services/auth';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccessLogin }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('creator');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail('demo@bridgenow.com');
    setPassword('password123');
    setMode('login');
    setError(null);
    setSuccessMsg('Loaded demo user credentials!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email.trim()) throw new Error('Please enter your email address.');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

        const result = await registerApi({ name, email, password, role });
        
        // Show registration success banner and switch to login tab (or automatically log in)
        setSuccessMsg('🎉 Account created successfully! Please sign in with your credentials.');
        setMode('login');
        setPassword('');
      } else {
        if (!email.trim()) throw new Error('Please enter your email address.');
        if (!password) throw new Error('Please enter your password.');

        const result = await loginApi({ email, password });
        if (onSuccessLogin) {
          onSuccessLogin(result.user);
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-all"
        onClick={onClose}
      />

      {/* Floating Modal Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[28px] border border-white/80 shadow-[0_25px_60px_-15px_rgba(134,59,255,0.35)] overflow-hidden z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Decorative Ambient Gradient Mesh behind header */}
        <div className="absolute -top-24 -left-20 w-56 h-56 bg-gradient-to-br from-[#863bff]/30 to-[#c084fc]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-56 h-56 bg-gradient-to-br from-[#7c3aed]/20 to-[#6d28d9]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span id="auth-modal-title" className="text-[#863bff] font-outfit font-extrabold text-2xl tracking-tight select-none">
                bridge-now
              </span>
              <span className="bg-purple-100 text-[#863bff] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#863bff]" /> SQL Auth
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {mode === 'login' ? 'Welcome back! Sign in to your account' : 'Join India\'s premier creator network'}
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="relative flex p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'login'
                ? 'bg-white text-[#863bff] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'register'
                ? 'bg-white text-[#863bff] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name input for Register mode */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Karan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 focus:border-[#863bff] focus:bg-white focus:ring-2 focus:ring-[#863bff]/20 rounded-2xl text-xs font-semibold text-slate-800 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 focus:border-[#863bff] focus:bg-white focus:ring-2 focus:ring-[#863bff]/20 rounded-2xl text-xs font-semibold text-slate-800 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 focus:border-[#863bff] focus:bg-white focus:ring-2 focus:ring-[#863bff]/20 rounded-2xl text-xs font-semibold text-slate-800 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector for Register mode */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">I want to join as</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'creator', label: 'Creator' },
                  { id: 'freelancer', label: 'Freelancer' },
                  { id: 'brand', label: 'Brand / Client' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                      role === item.id
                        ? 'bg-[#863bff]/10 border-[#863bff] text-[#863bff]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white font-bold text-xs tracking-wide shadow-[0_4px_15px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)] transition-all transform active:scale-95 duration-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Demo Autofill */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Testing locally?</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="font-bold text-[#863bff] hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#863bff]" /> Auto-fill Demo User
          </button>
        </div>

      </div>
    </div>
  );
}
