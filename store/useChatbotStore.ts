import { create } from 'zustand';
import { ChatMessage } from '../types';
import { sendToGemini } from '../services/chatbotApi';
import { withLocalStoragePersist } from './persist';

interface GuestTicketDraft {
  name?: string;
  phone?: string;
  description?: string;
  sector?: string;
  attachments?: string[];
}

type GuestStep = 'NONE' | 'NAME' | 'PHONE' | 'SECTOR' | 'DESCRIPTION' | 'CONFIRM';

interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isThinking: boolean;
  
  // Guest Flow State
  guestDraft: GuestTicketDraft;
  guestStep: GuestStep;

  toggleOpen: () => void;
  setOpen: (isOpen: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (text: string) => Promise<void>;
  
  // Guest Flow Actions
  initGuestWelcome: () => void;
  startGuestFlow: () => void;
  resetGuestFlow: () => void;
  updateGuestDraft: (updates: Partial<GuestTicketDraft>) => void;
}

export const useChatbotStore = create<ChatbotState>(
  withLocalStoragePersist(
    (set, get) => ({
      isOpen: false,
      messages: [
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Hello! I am your AI assistant. How can I help you with ticketing or market oversight today?',
          timestamp: Date.now(),
        }
      ],
      isThinking: false,
      guestDraft: {},
      guestStep: 'NONE',

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      
      updateGuestDraft: (updates) => set((state) => ({ guestDraft: { ...state.guestDraft, ...updates } })),

      resetGuestFlow: () => set({ guestDraft: {}, guestStep: 'NONE' }),

      initGuestWelcome: () => {
        set({
          messages: [{
            id: 'guest-welcome',
            sender: 'bot',
            text: 'Hello! I can help you create a ticket even without logging in. Type "Start" to begin, or ask me a question.',
            timestamp: Date.now(),
          }],
          guestStep: 'NONE',
          guestDraft: {}
        });
      },

      startGuestFlow: () => {
        const { addMessage } = get();
        set({ guestStep: 'NAME', guestDraft: {} });
        addMessage({
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Great! Let's get your ticket sorted. Before we begin, what is your name?",
          timestamp: Date.now(),
        });
      },

      sendMessage: async (text: string) => {
        const { addMessage, guestStep, guestDraft, resetGuestFlow, startGuestFlow, messages } = get();
        
        // User message
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          text,
          timestamp: Date.now(),
        };

        addMessage(userMessage);

        set({ isThinking: true });

        // Handle Unauthenticated / Guest Flow Triggers
        if (guestStep === 'NONE' && (text.toLowerCase().includes('ticket') || text.toLowerCase().includes('start'))) {
           setTimeout(() => {
             set({ isThinking: false });
             startGuestFlow();
           }, 800);
           return;
        }

        // Guest Flow State Machine
        if (guestStep !== 'NONE') {
          setTimeout(() => {
            set({ isThinking: false });
            let nextStep: GuestStep = guestStep;
            let botText = '';

            switch (guestStep) {
              case 'NAME':
                set({ guestDraft: { ...guestDraft, name: text }, guestStep: 'PHONE' });
                botText = `Nice to meet you, ${text}. What is your phone number?`;
                break;
              case 'PHONE':
                set({ guestDraft: { ...guestDraft, phone: text }, guestStep: 'SECTOR' });
                botText = "Got it. Which sector does this issue relate to? (e.g., Retail, Tech, Logistics)";
                break;
              case 'SECTOR':
                set({ guestDraft: { ...guestDraft, sector: text }, guestStep: 'DESCRIPTION' });
                botText = "Understood. Please describe your issue in detail.";
                break;
              case 'DESCRIPTION':
                 set({ guestDraft: { ...guestDraft, description: text }, guestStep: 'CONFIRM' });
                 botText = "Thank you. I have all the details. Should I submit this ticket now? (Yes/No)";
                 break;
              case 'CONFIRM':
                if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('sure') || text.toLowerCase().includes('ok')) {
                  // Finalize
                  const ticket = {
                    ...guestDraft,
                    id: `GUEST-${Date.now()}`,
                    createdAt: new Date().toISOString()
                  };
                  localStorage.setItem('guest_ticket', JSON.stringify(ticket));
                  botText = "Your ticket has been created! When you sign in, I will automatically link it to your account.";
                  resetGuestFlow();
                } else {
                  botText = "Okay, I've cancelled the draft. Let me know if you need anything else.";
                  resetGuestFlow();
                }
                break;
            }

            addMessage({
              id: (Date.now() + 1).toString(),
              sender: 'bot',
              text: botText,
              timestamp: Date.now(),
            });
          }, 1000);
          return;
        }

        // Standard AI logic (Real Gemini API)
        try {
          // Use the updated messages list which includes the new user message
          const history = [...messages, userMessage];
          const botResponse = await sendToGemini(history);
          
          set({ isThinking: false });
          addMessage(botResponse);
        } catch (error) {
          set({ isThinking: false });
          // Fallback error message if something fails completely outside the service
          addMessage({
            id: Date.now().toString(),
            sender: 'bot',
            text: "I encountered an internal error. Please try again later.",
            timestamp: Date.now(),
          });
        }
      },
    }),
    'chatbot_store',
    (state) => ({
      messages: state.messages,
      guestDraft: state.guestDraft,
      guestStep: state.guestStep
    })
  )
);
