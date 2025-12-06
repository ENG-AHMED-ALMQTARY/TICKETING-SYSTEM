import { create } from 'zustand';
import { Ticket } from '../types';
import { ticketsApi } from '../services/ticketsApi';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  currentTicket: null,
  isLoading: false,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const tickets = await ticketsApi.getTickets();
      set({ tickets, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchTicketById: async (id: string) => {
    set({ isLoading: true });
    try {
      const ticket = await ticketsApi.getTicketById(id);
      set({ currentTicket: ticket || null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createTicket: async (data: Partial<Ticket>) => {
    set({ isLoading: true });
    try {
      const ticket = await ticketsApi.createTicket(data);
      set(state => ({ 
        tickets: [...state.tickets, ticket], 
        isLoading: false 
      }));
      return ticket;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));
