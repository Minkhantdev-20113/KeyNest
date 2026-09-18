import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { KeysProvider } from './context/KeysContext';
import { ToastProvider } from './context/ToastContext';
import LoginDialog from './components/auth/LoginDialog';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import KeyList from './components/keys/KeyList';
import SettingsPanel from './components/settings/SettingsPanel';
import LandingScreen from './components/ui/LandingScreen';

function AuthGate({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <LandingScreen />;
  if (!isAuthenticated) return <LoginDialog />;
  return children;
}

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [keyAction, setKeyAction] = useState(null);

  const handleNavigate = (page, action) => {
    setActivePage(page);
    if (action) setKeyAction(action);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'keys':
        return <KeyList initialAction={keyAction} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGate>
          <KeysProvider>
            <AppContent />
          </KeysProvider>
        </AuthGate>
      </AuthProvider>
    </ToastProvider>
  );
}
