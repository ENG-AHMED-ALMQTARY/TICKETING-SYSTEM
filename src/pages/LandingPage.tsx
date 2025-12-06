
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield, Activity, Users, Globe } from 'lucide-react';
import { Button } from '../components/ui/Base';
import { useChatbotStore } from '../store/useChatbotStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { ChatWidget } from '../components/chatbot/ChatWidget';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOpen } = useChatbotStore();
  const { language, setLanguage, direction } = useLanguageStore();

  const openChat = () => {
    setOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-sans" dir={direction}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
           <Shield className="w-8 h-8 text-indigo-500" />
           <span className="text-xl font-bold font-display">SmartTicket</span>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
           <button 
             onClick={toggleLanguage}
             className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-indigo-600"
           >
             <Globe className="w-4 h-4" />
             <span className="text-sm font-bold uppercase">{language}</span>
           </button>
           <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
           <Button variant="primary" onClick={() => navigate('/login')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: direction === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Market Oversight
              </span>
              <br />
              Made Intelligent.
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              An enterprise-grade ticketing system powered by AI to detect price manipulation, product shortages, and supply chain irregularities in real-time.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
              <Button size="lg" onClick={openChat} className="group">
                <MessageSquare className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                Start Guest Chat
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Access Dashboard <ArrowRight className={`w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:${direction === 'rtl' ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                <div>
                   <h3 className="text-lg font-bold">Live System Metrics</h3>
                   <p className="text-xs text-slate-500">Real-time market analysis</p>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                   <span className="text-xs text-green-400 font-mono">LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Tickets", value: "1,240", icon: Activity, color: "text-indigo-400" },
                  { label: "Sectors Monitored", value: "12", icon: Shield, color: "text-purple-400" },
                  { label: "Issues Resolved", value: "98%", icon: Users, color: "text-green-400" },
                  { label: "Avg Response", value: "< 2h", icon: MessageSquare, color: "text-amber-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                     <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                     <div className="text-2xl font-bold">{stat.value}</div>
                     <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className={`absolute -bottom-10 ${direction === 'rtl' ? '-left-10' : '-right-10'} bg-indigo-600 p-4 rounded-xl shadow-xl flex items-center space-x-3 rtl:space-x-reverse`}
            >
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                 <Shield className="w-6 h-6 text-white" />
               </div>
               <div>
                 <p className="font-bold text-white text-sm">AI Protection</p>
                 <p className="text-xs text-indigo-200">24/7 Monitoring</p>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Global Chat Widget for Landing Page */}
      <ChatWidget />
    </div>
  );
};
