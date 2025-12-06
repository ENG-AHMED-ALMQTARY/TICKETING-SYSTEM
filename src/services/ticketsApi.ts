
import { Ticket, TicketStatus, TimelineItem, TicketType } from '../types';

// --- Types for Filtering ---
export interface TicketFilterParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: TicketStatus[];
  priority?: string[];
  sector?: string;
  dateFrom?: string;
  dateTo?: string;
  assigneeId?: string;
}

export interface TicketResponse {
  items: Ticket[];
  total: number;
  page: number;
  pageSize: number;
}

// --- Mock Data Generation ---
const GENERATE_COUNT = 55;
const SECTORS = ['Retail', 'Logistics', 'Tech', 'Healthcare', 'Finance'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TYPES = Object.values(TicketType);
const STATUSES = Object.values(TicketStatus);

const generateMockTickets = (): Ticket[] => {
  const tickets: Ticket[] = [];
  
  // Keep original static tickets
  tickets.push(
    {
      id: 't1',
      referenceNumber: 'REF-2023-001',
      title: 'Price surge on Milk',
      description: 'Local store selling milk at 2x price.',
      type: TicketType.PRICE_MANIPULATION,
      status: TicketStatus.OPEN,
      priority: 'HIGH',
      creatorId: 'u1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 172800000).toISOString(),
      attachments: [],
      sector: 'Retail',
    },
    {
      id: 't2',
      referenceNumber: 'REF-2023-002',
      title: 'Broken Refrigerator Unit',
      description: 'Unit 4B is not cooling.',
      type: TicketType.DAMAGED_GOODS,
      status: TicketStatus.ASSIGNED,
      assignedToId: 'u2',
      priority: 'MEDIUM',
      creatorId: 'u5',
      createdAt: new Date(Date.now() - 100000000).toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 86400000).toISOString(),
      attachments: [],
      sector: 'Logistics',
    }
  );

  // Generate random tickets
  for (let i = 0; i < GENERATE_COUNT; i++) {
    const dateOffset = Math.floor(Math.random() * 1000000000); // Random time in last ~10 days
    tickets.push({
      id: `mock-${i}`,
      referenceNumber: `REF-2023-${100 + i}`,
      title: `Issue with ${SECTORS[i % SECTORS.length]} shipment #${i}`,
      description: 'Automated mock ticket description for testing filtering and pagination.',
      type: TYPES[i % TYPES.length],
      status: STATUSES[i % STATUSES.length],
      priority: PRIORITIES[i % PRIORITIES.length] as any,
      creatorId: 'u1',
      createdAt: new Date(Date.now() - dateOffset).toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 86400000).toISOString(),
      attachments: [],
      sector: SECTORS[i % SECTORS.length],
    });
  }
  return tickets;
};

let MOCK_TICKETS: Ticket[] = generateMockTickets();

let MOCK_TIMELINE: Record<string, TimelineItem[]> = {
  't1': [
    { id: '1', type: 'STATUS_CHANGE', content: 'Ticket created', userId: 'u1', timestamp: new Date(Date.now() - 86400000).toISOString(), status: TicketStatus.OPEN }
  ],
  't2': [
    { id: '1', type: 'STATUS_CHANGE', content: 'Ticket created', userId: 'u5', timestamp: new Date(Date.now() - 100000000).toISOString(), status: TicketStatus.OPEN },
    { id: '2', type: 'ASSIGNMENT', content: 'Assigned to Tech Sarah', userId: 'admin', timestamp: new Date(Date.now() - 90000000).toISOString() },
    { id: '3', type: 'COMMENT', content: 'I will inspect this tomorrow morning.', userId: 'u2', timestamp: new Date(Date.now() - 80000000).toISOString(), user: { name: 'Tech Sarah' } }
  ]
};

const delay = <T>(data: T, ms = 400): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const ticketsApi = {
  // --- New Advanced Filtering Method ---
  getTickets: async (params: TicketFilterParams): Promise<TicketResponse> => {
    let filtered = [...MOCK_TICKETS];

    // 1. Text Search
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.referenceNumber.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (params.status && params.status.length > 0) {
      filtered = filtered.filter(t => params.status!.includes(t.status));
    }

    // 3. Priority Filter
    if (params.priority && params.priority.length > 0) {
      filtered = filtered.filter(t => params.priority!.includes(t.priority));
    }

    // 4. Sector Filter
    if (params.sector) {
      filtered = filtered.filter(t => t.sector === params.sector);
    }

    // 5. Date Range
    if (params.dateFrom) {
      const from = new Date(params.dateFrom).getTime();
      filtered = filtered.filter(t => new Date(t.createdAt).getTime() >= from);
    }
    if (params.dateTo) {
      const to = new Date(params.dateTo).getTime();
      // Add one day to include the end date fully
      const toDate = new Date(params.dateTo);
      toDate.setDate(toDate.getDate() + 1);
      filtered = filtered.filter(t => new Date(t.createdAt).getTime() < toDate.getTime());
    }

    // Sort by Date Descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(start, start + pageSize);

    return delay({
      items: paginatedItems,
      total,
      page,
      pageSize
    });
  },

  // Legacy support (redirects to getTickets)
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await ticketsApi.getTickets({ page: 1, pageSize: 1000 });
    return response.items;
  },
  
  getTicketById: async (id: string): Promise<Ticket | undefined> => {
    const ticket = MOCK_TICKETS.find(t => t.id === id);
    return delay(ticket);
  },

  createTicket: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    const newTicket = {
      ...ticket,
      id: Math.random().toString(36).substr(2, 9),
      referenceNumber: `REF-${Date.now()}`,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: ticket.attachments || [],
      type: ticket.type || TicketType.GENERAL_INQUIRY,
      priority: ticket.priority || 'MEDIUM',
      creatorId: 'current-user', // Mock user ID
    } as Ticket;

    MOCK_TICKETS.unshift(newTicket); // Add to top
    MOCK_TIMELINE[newTicket.id] = [{ 
      id: Date.now().toString(), 
      type: 'STATUS_CHANGE', 
      content: 'Ticket created', 
      userId: 'current-user', 
      timestamp: new Date().toISOString(),
      status: TicketStatus.OPEN
    }];
    return delay(newTicket, 600);
  },

  updateTicket: async (id: string, payload: Partial<Ticket>): Promise<Ticket> => {
    const ticketIndex = MOCK_TICKETS.findIndex(t => t.id === id);
    if (ticketIndex === -1) throw new Error("Ticket not found");

    const updatedTicket = {
      ...MOCK_TICKETS[ticketIndex],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    MOCK_TICKETS[ticketIndex] = updatedTicket;
    
    return delay(updatedTicket);
  },

  getTimeline: async (ticketId: string): Promise<TimelineItem[]> => {
    return delay(MOCK_TIMELINE[ticketId] || [], 400);
  },

  updateStatus: async (id: string, newStatus: TicketStatus): Promise<Ticket> => {
    const ticketIndex = MOCK_TICKETS.findIndex(t => t.id === id);
    if (ticketIndex === -1) throw new Error("Ticket not found");

    const updatedTicket = {
      ...MOCK_TICKETS[ticketIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    MOCK_TICKETS[ticketIndex] = updatedTicket;

    // Add Timeline Event
    const timelineEvent: TimelineItem = {
      id: Date.now().toString(),
      type: 'STATUS_CHANGE',
      content: `Status updated to ${newStatus}`,
      userId: 'current-user',
      timestamp: new Date().toISOString(),
      status: newStatus
    };
    
    if (!MOCK_TIMELINE[id]) MOCK_TIMELINE[id] = [];
    MOCK_TIMELINE[id].push(timelineEvent);

    return delay(updatedTicket, 600);
  },

  addComment: async (id: string, message: string): Promise<TimelineItem> => {
    const newComment: TimelineItem = {
      id: Date.now().toString(),
      type: 'COMMENT',
      content: message,
      userId: 'current-user',
      timestamp: new Date().toISOString(),
      user: { name: 'Current User' } // Mock user details
    };

    if (!MOCK_TIMELINE[id]) MOCK_TIMELINE[id] = [];
    MOCK_TIMELINE[id].push(newComment);
    
    return delay(newComment, 400);
  },

  uploadAttachment: async (ticketId: string, file: File): Promise<string> => {
    await delay(null, 1000);
    return URL.createObjectURL(file);
  }
};
