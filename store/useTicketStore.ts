import { create } from 'zustand';
import { Ticket, TimelineItem, TicketStatus } from '../types';
import { ticketsApi } from '../services/ticketsApi';
import { withLocalStoragePersist } from './persist';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  timeline: TimelineItem[];
  isLoading: boolean;
  
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
  
  // Interactive Actions
  fetchTimeline: (ticketId: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  addComment: (ticketId: string, message: string) => Promise<void>;
}

export const useTicketStore = create<TicketState>(
  withLocalStoragePersist(
    (set, get) => ({
      tickets: [],
      currentTicket: null,
      timeline: [],
      isLoading: false,

      fetchTickets: async () => {
        set({ isLoading: true });
        try {
          const tickets = await ticketsApi.getAllTickets();
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
      },

      fetchTimeline: async (ticketId: string) => {
        try {
          const timeline = await ticketsApi.getTimeline(ticketId);
          // Sort by timestamp descending (newest first) for UI
          const sorted = timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          set({ timeline: sorted });
        } catch (error) {
          console.error("Failed to fetch timeline", error);
        }
      },

      updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
        set({ isLoading: true });
        try {
          const updatedTicket = await ticketsApi.updateStatus(ticketId, status);
          
          // Update local state
          set(state => ({
            currentTicket: updatedTicket,
            tickets: state.tickets.map(t => t.id === ticketId ? updatedTicket : t),
            isLoading: false
          }));

          // Refresh timeline to show the status change
          await get().fetchTimeline(ticketId);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addComment: async (ticketId: string, message: string) => {
        // Optimistic update or wait for API? We'll wait for API for simplicity.
        try {
          const newComment = await ticketsApi.addComment(ticketId, message);
          set(state => ({
            timeline: [newComment, ...state.timeline]
          }));
        } catch (error) {
          console.error("Failed to add comment", error);
          throw error;
        }
      }
    }),
    'ticket_store',
    (state) => ({
      currentTicket: state.currentTicket
    })
  )
);