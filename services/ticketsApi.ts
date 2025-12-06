import { Ticket, TicketStatus, TimelineItem } from '../types';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    referenceNumber: 'REF-2023-001',
    title: 'Price surge on Milk',
    description: 'Local store selling milk at 2x price.',
    type: 'Price Manipulation' as any,
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
    type: 'Damaged Goods' as any,
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

export const ticketsApi = {
  getTickets: async (): Promise<Ticket[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_TICKETS]), 500));
  },
  
  getTicketById: async (id: string): Promise<Ticket | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TICKETS.find(t => t.id === id)), 500));
  },

  createTicket: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    return new Promise(resolve => {
      const newTicket = {
        ...ticket,
        id: Math.random().toString(36).substr(2, 9),
        referenceNumber: `REF-${Date.now()}`,
        status: TicketStatus.OPEN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: ticket.attachments || [],
      } as Ticket;
      MOCK_TICKETS.push(newTicket);
      setTimeout(() => resolve(newTicket), 800);
    });
  },

  getTimeline: async (ticketId: string): Promise<TimelineItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', type: 'STATUS_CHANGE', content: 'Ticket created', userId: 'u1', timestamp: new Date(Date.now() - 100000).toISOString() },
      { id: '2', type: 'COMMENT', content: 'Investigating this issue.', userId: 'u2', timestamp: new Date().toISOString() }
    ]), 400));
  }
};
