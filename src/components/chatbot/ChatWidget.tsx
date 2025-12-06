
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, FileText, Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useChatbotStore } from '../../store/useChatbotStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUploader } from './ImageUploader';

export const ChatWidget: React.FC = () => {
  const { 
    isOpen, toggleOpen, messages, sendMessage, 
    addMessage, isThinking, initGuestWelcome, updateGuestDraft, guestStep,
    context, setContext
  } = useChatbotStore();
  const { isAuthenticated } = useAuthStore();
  const { t, direction } = useLanguageStore();
  const location = useLocation();
  
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize Guest Mode if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !initializedRef.current) {
      initGuestWelcome();
      initializedRef.current = true;
    }
  }, [isAuthenticated, initGuestWelcome]);

  // Track Page Context
  useEffect(() => {
    // Basic route mapping to page names
    let pageName = 'Unknown Page';
    if (location.pathname === '/' || location.pathname === '') pageName = 'Landing Page';
    else if (location.pathname === '/login') pageName = 'Login';
    else if (location.pathname === '/dashboard') pageName = 'Dashboard';
    else if (location.pathname === '/tickets') pageName = 'Ticket List';
    else if (location.pathname === '/tickets/create') pageName = 'Create Ticket';
    else if (location.pathname.startsWith('/tickets/')) pageName = 'Ticket Detail';
    else if (location.pathname === '/analytics') pageName = 'Analytics';
    else if (location.pathname === '/admin') pageName = 'Admin User List';
    else if (location.pathname === '/notifications') pageName = 'Notifications';

    // Set basic context. TicketDetail component will upgrade this with specific data if needed.
    // We only set it here if we are NOT on a detail page, or we set a placeholder.
    // To allow TicketDetail to override, we set the base context.
    setContext({
      page: pageName,
      route: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname, setContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await sendMessage(inputText);
    setInputText('');
  };

  const handleVoiceInput = (text: string) => {
    setInputText(text);
  };

  const handleImageUpload = (file: File, preview: string) => {
    // Manually add the message with attachment
    addMessage({
      id: Date.now().toString(),
      sender: 'user',
      text: `Uploaded: ${file.name}`,
      timestamp: Date.now(),
      attachments: [preview]
    });
    
    // If in guest flow, save attachment to draft
    if (guestStep !== 'NONE') {
        updateGuestDraft({ attachments: [preview] });
    }

    // Simulate Bot response to image
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I've received your image. Analyzing visual data...",
        timestamp: Date.now(),
        isThinking: false
      });
    }, 1000);
  };

  // Determine alignment based on direction and sender
  const getBubbleAlignment = (sender: 'user' | 'bot') => {
    if (direction === 'rtl') {
      return sender === 'user' ? 'justify-start' : 'justify-end';
    }
    return sender === 'user' ? 'justify-end' : 'justify-start';
  };

  const getBubbleStyle = (sender: 'user' | 'bot') => {
    if (sender === 'user') {
      return direction === 'rtl' 
        ? 'bg-indigo-600 text-white rounded-tl-none' // User left in RTL
        : 'bg-indigo-600 text-white rounded-tr-none'; // User right in LTR
    } else {
      return direction === 'rtl'
        ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700' // Bot right in RTL
        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'; // Bot left in LTR
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 ${direction === 'rtl' ? 'left-6' : 'right-6'} w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {isAuthenticated ? t('supportAssistant') : t('guestSupport')}
                  </h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                     <div className="flex items-center space-x-1 rtl:space-x-reverse">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-xs text-slate-400">{t('online')}</span>
                     </div>
                     {context?.ticketRef && (
                       <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 flex items-center">
                         <Eye className="w-3 h-3 mr-1" /> {context.ticketRef}
                       </span>
                     )}
                  </div>
                </div>
              </div>
              <button onClick={toggleOpen} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${getBubbleAlignment(msg.sender)}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${getBubbleStyle(msg.sender)}`}
                  >
                    {/* Render Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2">
                        {msg.attachments.map((url, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-white/20">
                            {url.startsWith('data:image') ? (
                               <img src={url} alt="User upload" className="max-w-full h-auto object-cover" />
                            ) : (
                               <div className="bg-slate-700 p-2 flex items-center space-x-2 rtl:space-x-reverse">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs truncate">Attachment {idx + 1}</span>
                               </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Render Text */}
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className={`flex ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`bg-slate-800 p-3 rounded-2xl border border-slate-700 flex space-x-1 items-center ${direction === 'rtl' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <ImageUploader onImageSelected={handleImageUpload} />
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={guestStep !== 'NONE' ? t('answerBot') : t('typeMessage')}
                    className={`w-full bg-slate-900 border border-slate-700 rounded-full py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${direction === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'left-2' : 'right-2'}`}>
                    <VoiceRecorder onRecordingComplete={handleVoiceInput} />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isThinking}
                  className={`p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${direction === 'rtl' ? 'rotate-180' : ''}`}
                >
                  {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`fixed bottom-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white z-50 hover:bg-indigo-500 transition-colors`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </>
  );
};
