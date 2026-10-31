import React, { useState, useEffect } from 'react';
import { User, CaseItem } from './types';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { CaseWorkspace } from './views/CaseWorkspace';
import { ForensicReportView } from './views/ForensicReportView';
import { AuthView } from './views/AuthView';
import { NewCaseModal } from './components/NewCaseModal';
import { DemoSelectionModal } from './components/DemoSelectionModal';
import { DeleteCaseModal } from './components/DeleteCaseModal';
import { ToastProvider, useToast } from './components/ToastProvider';

const MainAppContent: React.FC = () => {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace' | 'report'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_demo_01',
    email: 'investigator@metro.gov',
    full_name: 'Detective Sarah Vance',
    badge_number: 'INV-9482',
    department: 'Major Collision Investigation Squad (MCIS)',
    role: 'Senior Forensic Specialist'
  });

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<CaseItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all cases from API
  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data);
        if (data.length > 0 && !activeCase) {
          setActiveCase(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Multi-Demo Loader Handler
  const handleSelectDemo = async (demoId: 'demo1' | 'demo2' | 'demo3') => {
    setIsLoadingDemo(true);
    try {
      const res = await fetch('/api/demo/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_id: demoId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to load demo');

      await fetchCases();

      // Fetch fresh demo case
      const caseRes = await fetch(`/api/cases/${data.case_id}`);
      if (caseRes.ok) {
        const c = await caseRes.json();
        setActiveCase(c);
        setCurrentView('workspace');
        showToast('success', 'Demo Scenario Loaded', data.message || `Case ${c.case_number} loaded into workspace.`);
      }
    } catch (err: any) {
      showToast('error', 'Failed to Load Demo', err.message || 'Server error loading scenario.');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  // Case Deletion with Relational DB Cleanup
  const handleConfirmDelete = async (caseId: string) => {
    const res = await fetch(`/api/cases/${caseId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to delete case');

    showToast('success', 'Case Deleted', 'Investigation file and associated evidence records purged.');
    const remaining = cases.filter(c => c.id !== caseId);
    setCases(remaining);
    if (activeCase?.id === caseId) {
      setActiveCase(remaining.length > 0 ? remaining[0] : null);
      setCurrentView('dashboard');
    }
  };

  const handleSelectCase = (c: CaseItem) => {
    setActiveCase(c);
    setCurrentView('workspace');
  };

  const handleCaseCreated = (newCase: CaseItem) => {
    setCases(prev => [newCase, ...prev]);
    setActiveCase(newCase);
    setCurrentView('workspace');
    showToast('success', 'Investigation Created', `Case ${newCase.case_number} registered.`);
  };

  return (
    <div className="relative min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Animated Futuristic Intelligence Canvas */}
      <AnimatedBackground />

      {/* Main Glassmorphic Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => setCurrentView(view as any)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLoadDemo={() => setIsDemoModalOpen(true)}
        activeCase={activeCase}
        isLoadingDemo={isLoadingDemo}
      />

      {/* Main View Router */}
      <main className="relative z-10 flex-1">
        {currentView === 'landing' && (
          <LandingView
            onLaunchInvestigation={() => {
              if (currentUser) setCurrentView('dashboard');
              else setIsAuthModalOpen(true);
            }}
            onExploreDemo={() => setIsDemoModalOpen(true)}
            isLoadingDemo={isLoadingDemo}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            cases={cases}
            onSelectCase={handleSelectCase}
            onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
            onLoadDemo={() => setIsDemoModalOpen(true)}
            isLoadingDemo={isLoadingDemo}
            onRequestDeleteCase={(c) => {
              setCaseToDelete(c);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {currentView === 'workspace' && activeCase && (
          <CaseWorkspace
            activeCase={activeCase}
            onNavigateToReport={() => setCurrentView('report')}
            onRefreshCase={fetchCases}
          />
        )}

        {currentView === 'report' && activeCase && (
          <ForensicReportView
            activeCase={activeCase}
            onBackToWorkspace={() => setCurrentView('workspace')}
          />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthView
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
        }}
      />

      {/* Create New Case Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* Demo Selection Modal (Demo 1, 2, 3) */}
      <DemoSelectionModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectDemo={handleSelectDemo}
      />

      {/* Relational Case Deletion Confirmation Modal */}
      <DeleteCaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCaseToDelete(null);
        }}
        caseItem={caseToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
};

export default App;

