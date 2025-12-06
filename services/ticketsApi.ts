import { Ticket, TicketStatus, TimelineItem, TicketType } from '../types';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    referenceNumber: 'REF-2023-001',
    title: 'Price surge on Milk',
    description: 'Local store selling milk at 2x price.',
    type: TicketType.PRICE_MANIPULATION,
    status: TicketStatus.OPEN,
    priority: 'HIGH',
    creatorId: 'u1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
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
];

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

const delay = <T>(data: T, ms = 500): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const ticketsApi = {
  getAllTickets: async (): Promise<Ticket[]> => {
    return delay([...MOCK_TICKETS]);
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

    MOCK_TICKETS.push(newTicket);
    MOCK_TIMELINE[newTicket.id] = [{ 
      id: Date.now().toString(), 
      type: 'STATUS_CHANGE', 
      content: 'Ticket created', 
      userId: 'current-user', 
      timestamp: new Date().toISOString(),
      status: TicketStatus.OPEN
    }];
    return delay(newTicket, 800);
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
    // Simulate upload delay and return a mock URL
    // In a real app, this would return an S3/Blob storage URL
    await delay(null, 1000);
    return URL.createObjectURL(file);
  }
};