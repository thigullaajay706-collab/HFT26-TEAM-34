import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  UserCheck, 
  BadgeCheck, 
  Building2, 
  ArrowRight, 
  X,
  Fingerprint
} from 'lucide-react';
import { User } from '../types';

interface AuthViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('investigator@metro.gov');
  const [password, setPassword] = useState('demo123456');
  const [fullName, setFullName] = useState('Detective Sarah Vance');
  const [badgeNumber, setBadgeNumber] = useState('INV-9482');
  const [department, setDepartment] = useState('Major Collision Investigation Squad (MCIS)');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Demo login failed');
      onSuccess(data);
      onClose();
    } catch (err: any) {
      // Offline fallback
      onSuccess({
        id: 'usr_demo_01',
        email: 'investigator@metro.gov',
        full_name: 'Detective Sarah Vance',
        badge_number: 'INV-9482',
        department: 'Major Collision Investigation Squad (MCIS)',
        role: 'Senior Forensic Specialist'
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister 
      ? { email, password, full_name: fullName, badge_number: badgeNumber, department }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      onSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Futuristic Forensic Intelligence Graphic */}
        <div className="md:w-5/12 bg-gradient-to-br from-cyan-950/80 via-[#0a1128] to-[#04060d] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-cyan-500/20 relative overflow-hidden">
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid-cyan opacity-30 pointer-events-none" />
          
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Accident<span className="text-cyan-400">IQ</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold font-heading text-white mb-2">
              Forensic Portal Access
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authorized access for collision investigators, traffic reconstruction specialists, and law enforcement analysts.
            </p>

            {/* Department specs */}
            <div className="mt-8 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono space-y-1.5 text-cyan-200">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <Fingerprint className="w-4 h-4" />
                <span>SECURE EVIDENCE VAULT</span>
              </div>
              <p className="text-[11px] text-slate-400">
                AES-256 evidence encryption · Chain-of-custody logging · Rule 702 Daubert compliance
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <span>Terminal: MCIS-RADAR-STATION-01</span>
          </div>
        </div>

        {/* Right Side: Auth Form & 1-Click Demo */}
        <div className="md:w-7/12 p-6 sm:p-8 bg-[#070b18]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-heading text-white">
              {isRegister ? 'Register New Investigator' : 'Investigator Sign In'}
            </h3>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              {isRegister ? 'Switch to Sign In' : 'Create New Account'}
            </button>
          </div>

          {/* 1-Click Demo Investigator Button */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 shadow-neon-cyan">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                <BadgeCheck className="w-4 h-4 text-cyan-400" />
                <span>Hackathon Evaluator Access</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400 text-black font-bold">
                1-CLICK DEMO
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Instantly authenticate as <strong>Detective Sarah Vance (INV-9482)</strong> with pre-configured access to the intersection crash case.
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Launch as Demo Investigator</span>
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
            <div className="relative flex justify-center text-xs font-mono uppercase text-slate-500">
              <span className="bg-[#070b18] px-2">or standard credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
                    placeholder="e.g. Officer Marcus Chen"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Badge Number</label>
                    <input
                      type="text"
                      required
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
                      placeholder="INV-1029"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
                      placeholder="MCIS"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Official Police Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
                  placeholder="name@metro.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
