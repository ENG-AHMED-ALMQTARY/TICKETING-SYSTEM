import { create } from 'zustand';
import { ChatMessage } from '../types';

interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isThinking: boolean;
  toggleOpen: () => void;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
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
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  sendMessage: async (text: string) => {
    const { addMessage } = get();
    
    // User message
    addMessage({
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    });

    set({ isThinking: true });

    // Simulate AI delay
    setTimeout(() => {
      set({ isThinking: false });
      addMessage({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `I understand you said: "${text}". I can help process that. Would you like to create a ticket?`,
        timestamp: Date.now(),
      });
    }, 1500);
  },
}));
