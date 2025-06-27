import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import StudySession from './pages/StudySession';
import SocialHub from './pages/SocialHub';
import Settings from './pages/Settings';
import AuthModal from './components/auth/AuthModal';
import { useAuthStore } from './store/authStore';
import { useUserDataStore } from './store/userDataStore';

function App() {
  const { isAuthenticated, showAuthModal, user } = useAuthStore();
  const { syncUserData } = useUserDataStore();

  // Sync user data when app loads and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      syncUserData(user.id);
    }
  }, [isAuthenticated, user]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          
          {/* Protected Routes - Only accessible when authenticated */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/study" element={<StudySession />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <>
              {/* Redirect all protected routes to home when not authenticated */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/courses" element={<Navigate to="/" replace />} />
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
        
        {/* Auth Modal - Only show when not authenticated */}
        {showAuthModal && !isAuthenticated && <AuthModal />}
        
        {/* Toast Notifications */}
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
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;