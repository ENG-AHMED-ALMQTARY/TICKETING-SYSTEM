import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { useAuthStore } from './store/useAuthStore';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </div>
      <ChatWidget />
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Placeholder for other routes */}
        <Route path="/tickets" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Ticket Management</h1><p className="text-slate-400">Coming soon in full implementation.</p></div>
          </ProtectedRoute>
        } />
        
         <Route path="/analytics" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Analytics Builder</h1><p className="text-slate-400">Coming soon in full implementation.</p></div>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
