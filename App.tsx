import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { User, UserRole, Job } from './types';
import { storageService } from './services/storageService';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import JobCreate from './pages/JobCreate';
import JobDetail from './pages/JobDetail';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage(currentUser.role === UserRole.ADMIN ? 'recruiter-dash' : 'candidate-dash');
    }
  }, []);

  const handleLogin = async (email: string, role: UserRole) => {
    const loggedInUser = await storageService.login(email, role);
    setUser(loggedInUser);
    setCurrentPage(role === UserRole.ADMIN ? 'recruiter-dash' : 'candidate-dash');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentPage('landing');
    setSelectedJobId(null);
  };

  const navigateToJobCreate = () => setCurrentPage('job-create');
  
  const navigateToJobDetail = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage('job-detail');
  };

  const navigateToDashboard = () => {
    if (!user) {
      setCurrentPage('landing');
      return;
    }
    setCurrentPage(user.role === UserRole.ADMIN ? 'recruiter-dash' : 'candidate-dash');
  };

  // Router Logic
  const renderPage = () => {
    if (!user && currentPage === 'landing') return <Landing onStart={() => setCurrentPage('login')} />;
    if (!user || currentPage === 'login') return <Login onLogin={handleLogin} onCancel={() => setCurrentPage('landing')} />;

    if (user.role === UserRole.ADMIN) {
      switch (currentPage) {
        case 'recruiter-dash':
          return <RecruiterDashboard user={user} onCreateJob={navigateToJobCreate} onViewJob={navigateToJobDetail} />;
        case 'job-create':
          return <JobCreate user={user} onCancel={navigateToDashboard} onSuccess={navigateToDashboard} />;
        case 'job-detail':
          return selectedJobId ? <JobDetail user={user} jobId={selectedJobId} onBack={navigateToDashboard} /> : <RecruiterDashboard user={user} onCreateJob={navigateToJobCreate} onViewJob={navigateToJobDetail} />;
        default:
          return <RecruiterDashboard user={user} onCreateJob={navigateToJobCreate} onViewJob={navigateToJobDetail} />;
      }
    }

    if (user.role === UserRole.CANDIDATE) {
      switch (currentPage) {
        case 'candidate-dash':
          return <CandidateDashboard user={user} />;
        default:
          return <CandidateDashboard user={user} />;
      }
    }
    
    return <Landing onStart={() => setCurrentPage('login')} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onNavigate={navigateToDashboard} />
      <main className="flex-grow">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;