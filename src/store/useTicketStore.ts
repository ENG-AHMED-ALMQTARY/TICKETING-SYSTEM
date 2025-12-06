
import { create } from 'zustand';
import { Ticket, TimelineItem, TicketStatus } from '../types';
import { ticketsApi, TicketFilterParams } from '../services/ticketsApi';
import { withLocalStoragePersist } from './persist';

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  timeline: TimelineItem[];
  isLoading: boolean;
  
  // Filtering & Pagination
  filters: TicketFilterParams;
  pagination: PaginationState;
  
  // Actions
  setFilters: (filters: Partial<TicketFilterParams>) => void;
  resetFilters: () => void;
  setPagination: (page: number, pageSize: number) => void;
  loadTickets: () => Promise<void>;
  
  // Legacy/Compatibility
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
  fetchTimeline: (ticketId: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  addComment: (ticketId: string, message: string) => Promise<void>;
}

const INITIAL_FILTERS: TicketFilterParams = {
  q: '',
  status: [],
  priority: [],
  sector: '',
  dateFrom: '',
  dateTo: ''
};

export const useTicketStore = create<TicketState>(
  withLocalStoragePersist(
    (set, get) => ({
      tickets: [],
      currentTicket: null,
      timeline: [],
      isLoading: false,
      
      filters: INITIAL_FILTERS,
      pagination: {
        page: 1,
        pageSize: 9,
        total: 0
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
        }));
      },

      resetFilters: () => {
        set({ filters: INITIAL_FILTERS, pagination: { page: 1, pageSize: 9, total: 0 } });
      },

      setPagination: (page, pageSize) => {
        set((state) => ({ pagination: { ...state.pagination, page, pageSize } }));
      },

      loadTickets: async () => {
        set({ isLoading: true });
        try {
          const { filters, pagination } = get();
          const params = {
            ...filters,
            page: pagination.page,
            pageSize: pagination.pageSize
          };
          
          const response = await ticketsApi.getTickets(params);
          
          set({ 
            tickets: response.items,
            pagination: {
              page: response.page,
              pageSize: response.pageSize,
              total: response.total
            },
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to load tickets", error);
          set({ isLoading: false });
        }
      },

      // Alias for compatibility with existing components
      fetchTickets: async () => {
        await get().loadTickets();
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
          // Reload the list to include the new ticket (respecting sorting/filtering)
          await get().loadTickets();
          return ticket;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchTimeline: async (ticketId: string) => {
        try {
          const timeline = await ticketsApi.getTimeline(ticketId);
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
          set(state => ({
            currentTicket: updatedTicket,
            // Optimistic update of the list
            tickets: state.tickets.map(t => t.id === ticketId ? updatedTicket : t),
            isLoading: false
          }));
          await get().fetchTimeline(ticketId);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addComment: async (ticketId: string, message: string) => {
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
      currentTicket: state.currentTicket,
      filters: state.filters // Persist filters
    })
  )
);
