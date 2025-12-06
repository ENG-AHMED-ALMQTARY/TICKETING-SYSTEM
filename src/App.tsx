
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { GuestClaimModal } from './components/chatbot/GuestClaimModal';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { TicketList } from './pages/tickets/TicketList';
import { TicketCreate } from './pages/tickets/TicketCreate';
import { TicketDetail } from './pages/tickets/TicketDetail';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UserList } from './pages/admin/UserList';
import { LandingPage } from './pages/LandingPage';
import { useAuthStore } from './store/useAuthStore';
import { useTicketStore } from './store/useTicketStore';
import { useLanguageStore } from './store/useLanguageStore';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const { createTicket } = useTicketStore();
  const { direction } = useLanguageStore();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [guestTicketData, setGuestTicketData] = useState<any>(null);

  // Ensure direction is set correctly on mount/update
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  useEffect(() => {
    // Check for guest ticket on mount if user is logged in
    const storedTicket = localStorage.getItem('guest_ticket');
    if (storedTicket && user) {
       try {
         const parsed = JSON.parse(storedTicket);
         setGuestTicketData(parsed);
         setShowClaimModal(true);
       } catch (e) {
         localStorage.removeItem('guest_ticket');
       }
    }
  }, [user]);

  const handleClaim = async () => {
    if (guestTicketData) {
      await createTicket({
        title: `Guest Ticket: ${guestTicketData.sector || 'General'}`,
        description: guestTicketData.description,
        type: 'General Inquiry' as any, // Default type
        sector: guestTicketData.sector,
        priority: 'MEDIUM'
      });
      localStorage.removeItem('guest_ticket');
      setShowClaimModal(false);
      alert("Ticket claimed successfully!");
    }
  };

  const handleIgnore = () => {
    localStorage.removeItem('guest_ticket');
    setShowClaimModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <Sidebar />
      <div className={`flex-1 ${direction === 'rtl' ? 'mr-64 ml-0' : 'ml-64 mr-0'} p-8 overflow-y-auto relative transition-all duration-300`}>
        <Header />
        {children}
      </div>
      <ChatWidget />
      <GuestClaimModal 
        isOpen={showClaimModal}
        ticketData={guestTicketData}
        onClaim={handleClaim}
        onIgnore={handleIgnore}
      />
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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
