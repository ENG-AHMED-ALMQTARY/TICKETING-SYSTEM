
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight, Globe } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Input, Button } from '../components/ui/Base';

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('consumer@test.com');
  const { login, isLoading } = useAuthStore();
  const { t, direction, language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden" dir={direction}>
      {/* Language Toggle (Auth Page Exclusive) */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-50 flex items-center space-x-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full text-white hover:bg-indigo-600 transition-all shadow-lg"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold">{language === 'en' ? 'العربية' : 'English'}</span>
      </button>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Ticket className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">{t('signInTitle')}</h2>
        <p className="text-center text-slate-400 mb-8">{t('signInSubtitle')}</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label={t('emailLabel')} 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
          
          <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            {t('signInButton')} 
            <ArrowRight className={`w-4 h-4 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {t('testAccounts')}: <br/>
            consumer@test.com, tech@test.com, manager@test.com, admin@test.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};
