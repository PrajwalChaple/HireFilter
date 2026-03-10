import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { User, UserRole } from './types';
import { storageService } from './services/storageService';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import JobCreate from './pages/JobCreate';
import JobDetail from './pages/JobDetail';
import JobApplicants from './pages/JobApplicants';
import ApplicantDetail from './pages/ApplicantDetail';

import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';

// --- Wrapper Components for useParams ---
function JobDetailWrapper({ user, onBack }: { user: User; onBack: () => void }) {
  const { jobId } = useParams();
  if (!jobId) return <Navigate to="/" replace />;
  return <JobDetail user={user} jobId={jobId} onBack={onBack} />;
}

function JobApplicantsWrapper({ user, onBack, onViewApplicant }: { user: User; onBack: () => void; onViewApplicant: (jobId: string, appId: string) => void }) {
  const { jobId } = useParams();
  if (!jobId) return <Navigate to="/" replace />;
  return <JobApplicants user={user} jobId={jobId} onBack={onBack} onViewApplicant={(appId) => onViewApplicant(jobId, appId)} />;
}

function ApplicantDetailWrapper({ user, onBack }: { user: User; onBack: () => void }) {
  const { jobId, appId } = useParams();
  if (!jobId || !appId) return <Navigate to="/" replace />;
  return <ApplicantDetail user={user} jobId={jobId} appId={appId} onBack={onBack} />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = storageService.initAuthListener((loggedInUser) => {
      setUser(loggedInUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleLogin = async (email: string, password: string, name: string, role: UserRole, isSignup: boolean) => {
    try {
      if (isSignup) {
        await storageService.signup(email, password, name, role);
      } else {
        await storageService.login(email, password);
      }
      navigate(role === UserRole.ADMIN ? '/recruiter-dash' : '/candidate-dash');
    } catch (error: any) {
      console.error("Auth failed:", error);
      throw error; // Re-throw to be caught by the Login component for UI error display
    }
  };

  const handleLogout = async () => {
    await storageService.logout();
    navigate('/');
  };

  const navigateToJobCreate = () => navigate('/job-create');
  const navigateToJobDetail = (jobId: string) => navigate(`/job/${jobId}`);
  const navigateToJobApplicants = (jobId: string) => navigate(`/job/${jobId}/applicants`);
  const navigateToApplicantDetail = (jobId: string, appId: string) => navigate(`/job/${jobId}/applicant/${appId}`);

  const navigateToDashboard = () => {
    if (!user) { navigate('/'); return; }
    navigate(user.role === UserRole.ADMIN ? '/recruiter-dash' : '/candidate-dash');
  };

  const getDashRedirect = () => user?.role === UserRole.ADMIN ? '/recruiter-dash' : '/candidate-dash';

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-xl font-bold text-gray-700">Connecting to HireFilter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onNavigate={navigateToDashboard} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={!user ? <Landing onStart={() => navigate('/login')} /> : <Navigate to={getDashRedirect()} replace />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} onCancel={() => navigate('/')} /> : <Navigate to={getDashRedirect()} replace />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter-dash" element={
            user?.role === UserRole.ADMIN ?
              <RecruiterDashboard user={user} onCreateJob={navigateToJobCreate} onViewJob={navigateToJobApplicants} /> :
              <Navigate to="/" replace />
          } />
          <Route path="/job-create" element={
            user?.role === UserRole.ADMIN ?
              <JobCreate user={user} onCancel={navigateToDashboard} onSuccess={navigateToDashboard} /> :
              <Navigate to="/" replace />
          } />
          <Route path="/job/:jobId/applicants" element={
            user?.role === UserRole.ADMIN ?
              <JobApplicantsWrapper user={user} onBack={navigateToDashboard} onViewApplicant={navigateToApplicantDetail} /> :
              <Navigate to="/" replace />
          } />
          <Route path="/job/:jobId/applicant/:appId" element={
            user?.role === UserRole.ADMIN ?
              <ApplicantDetailWrapper user={user} onBack={() => navigate(-1)} /> :
              <Navigate to="/" replace />
          } />

          {/* Candidate Routes */}
          <Route path="/candidate-dash" element={
            user?.role === UserRole.CANDIDATE ?
              <CandidateDashboard user={user} onViewJob={navigateToJobDetail} /> :
              <Navigate to="/" replace />
          } />
          <Route path="/job/:jobId" element={
            user ?
              <JobDetailWrapper user={user} onBack={navigateToDashboard} /> :
              <Navigate to="/" replace />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;