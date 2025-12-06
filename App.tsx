import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { TicketList } from './pages/tickets/TicketList';
import { TicketCreate } from './pages/tickets/TicketCreate';
import { TicketDetail } from './pages/tickets/TicketDetail';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UserList } from './pages/admin/UserList';
import { useAuthStore } from './store/useAuthStore';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto relative">
        <Header />
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
        
        {/* Ticket Routes */}
        <Route path="/tickets" element={
          <ProtectedRoute>
            <TicketList />
          </ProtectedRoute>
        } />
        <Route path="/tickets/create" element={
          <ProtectedRoute>
            <TicketCreate />
          </ProtectedRoute>
        } />
        <Route path="/tickets/:id" element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        } />
        
        {/* Analytics Routes */}
         <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
             <UserList />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;