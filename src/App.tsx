import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import SocialHub from './pages/SocialHub';
import Settings from './pages/Settings';
import AuthModal from './components/auth/AuthModal';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, showAuthModal } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          
          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study" element={<StudySession />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/study" element={<Navigate to="/" replace />} />
              <Route path="/social" element={<Navigate to="/" replace />} />
              <Route path="/settings" element={<Navigate to="/" replace />} />
            </>
          )}
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} 
          />
        </Routes>
        
        {showAuthModal && <AuthModal />}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;