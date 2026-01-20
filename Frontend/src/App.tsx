

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';

import AuthCallbackPage from './pages/AuthCallbackPage';

import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const AppContent = (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );

  // Only wrap with GoogleOAuthProvider if clientId is available
  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {AppContent}
      </GoogleOAuthProvider>
    );
  }

  return AppContent;
}

export default App;
