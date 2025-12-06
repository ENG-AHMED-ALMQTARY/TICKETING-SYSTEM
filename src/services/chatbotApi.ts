import { ChatMessage } from '../types';
import { ChatContext } from '../store/useChatbotStore';

// Safely access environment variable to prevent runtime errors
// Use optional chaining for import.meta.env and fallback to process.env if available
const API_KEY = ((import.meta as any).env?.VITE_GEMINI_API_KEY) || 
                (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : undefined);

const SYSTEM_PROMPT = `You are a helpful assistant for a ticketing system. 
You help classify issues, collect information, and guide users.`;

export async function sendToGemini(messages: ChatMessage[], context?: ChatContext): Promise<ChatMessage> {
  if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is not defined. Using mock response.");
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: "I'm currently in offline mode (API Key missing). I can still help you draft a ticket if you type 'start'.",
      timestamp: Date.now()
    };
  }

  // Build Context String
  let systemInstructionText = SYSTEM_PROMPT;
  if (context) {
    const contextStr = `\n\nCURRENT CONTEXT:\nUser is viewing page: ${context.page} (${context.route}).`;
    let ticketStr = "";
    if (context.ticketRef) {
      ticketStr = `\nActive Ticket Details:\nReference: ${context.ticketRef}\nStatus: ${context.ticketStatus}\nPriority: ${context.ticketPriority}\nTicket ID: ${context.ticketId}`;
    }
    systemInstructionText += contextStr + ticketStr;
  }

  // Filter and map messages to Gemini format
  // We exclude attachments for now as the prompt only requested text handling via fetch
  const contents = messages
    .filter(msg => msg.text) // Ensure text exists
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botText) {
      throw new Error('No content returned from Gemini');
    }

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: botText,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error('Failed to send message to Gemini:', error);
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: "Sorry, I could not reach the server. Please try again.",
      timestamp: Date.now()
    };
  }
}