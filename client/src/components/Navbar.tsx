import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  FileText, 
  PlayCircle, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Compass,
  FolderOpen
} from 'lucide-react';
import { User, CaseItem } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onLoadDemo: () => void;
  activeCase: CaseItem | null;
  isLoadingDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  onOpenAuth,
  onLoadDemo,
  activeCase,
  isLoadingDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-neon-cyan group-hover:scale-105 transition-transform duration-300">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-xl tracking-wider text-white">
                  Accident<span className="text-cyan-400">IQ</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Timeline & Trajectory Reconstruction
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentView === 'landing'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentView === 'dashboard'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {activeCase && (
              <button
                onClick={() => setCurrentView('workspace')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'workspace'
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Investigation Workspace</span>
              </button>
            )}

            {activeCase && (
              <button
                onClick={() => setCurrentView('report')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'report'
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Forensic Report</span>
              </button>
            )}
          </div>

          {/* Action CTAs & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Loader */}
            <button
              onClick={onLoadDemo}
              disabled={isLoadingDemo}
              className="relative inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg text-cyan-300 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/50 hover:border-cyan-400 shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              title="Loads the pre-configured intersection collision scenario (Sedan vs Motorcycle)"
            >
              <PlayCircle className={`w-4 h-4 mr-1.5 text-cyan-400 ${isLoadingDemo ? 'animate-spin' : ''}`} />
              <span>{isLoadingDemo ? 'Loading Demo...' : 'Load Crash Demo'}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-700/60">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-left">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                    {currentUser.badge_number.slice(0, 3)}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-slate-200">{currentUser.full_name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">{currentUser.badge_number} · MCIS</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out of investigator session"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neon-cyan transition-all"
              >
                Investigator Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onLoadDemo}
              disabled={isLoadingDemo}
              className="px-2.5 py-1.5 text-xs rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-cyan-500/20 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
          >
            Dashboard
          </button>
          {activeCase && (
            <button
              onClick={() => { setCurrentView('workspace'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-sm text-cyan-300 hover:bg-slate-800"
            >
              Workspace ({activeCase.case_number})
            </button>
          )}
          {activeCase && (
            <button
              onClick={() => { setCurrentView('report'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded text-sm text-emerald-300 hover:bg-slate-800"
            >
              Forensic Report
            </button>
          )}
          <div className="pt-2 border-t border-slate-700">
            {currentUser ? (
              <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                <span>{currentUser.full_name} ({currentUser.badge_number})</span>
                <button onClick={onLogout} className="text-red-400">Logout</button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold rounded bg-cyan-500 text-black font-medium"
              >
                Investigator Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
