import { Ticket, TicketStatus, TicketType, User, UserRole } from '../types';

const DELAY = 600;

const mockUsers: User[] = [
  { id: 'u1', name: 'John Doe', email: 'consumer@test.com', role: UserRole.CONSUMER },
  { id: 'u2', name: 'Tech Sarah', email: 'tech@test.com', role: UserRole.TECHNICIAN },
  { id: 'u3', name: 'Manager Mike', email: 'manager@test.com', role: UserRole.MANAGER },
  { id: 'u4', name: 'Admin Alice', email: 'admin@test.com', role: UserRole.ADMIN },
  { id: 'u5', name: 'Retailer Bob', email: 'retailer@test.com', role: UserRole.RETAILER, organization: 'Bob\'s Market' },
];

const mockTickets: Ticket[] = [
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
  }
];

// Helper to simulate network delay
const delay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), DELAY));
};

export const api = {
  auth: {
    login: async (email: string): Promise<User> => {
      const user = mockUsers.find(u => u.email === email);
      if (!user) throw new Error('User not found');
      return delay(user);
    },
    getCurrentUser: async (): Promise<User | null> => {
      // Simulate session check
      return delay(mockUsers[0]); 
    }
  },
  tickets: {
    getAll: async (): Promise<Ticket[]> => {
      return delay(mockTickets);
    },
    create: async (ticket: Partial<Ticket>): Promise<Ticket> => {
      const newTicket: Ticket = {
        id: Math.random().toString(36).substr(2, 9),
        referenceNumber: `REF-${Date.now()}`,
        title: ticket.title || 'New Ticket',
        description: ticket.description || '',
        type: ticket.type || TicketType.GENERAL_INQUIRY,
        status: TicketStatus.OPEN,
        priority: 'MEDIUM',
        creatorId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slaDeadline: new Date(Date.now() + 259200000).toISOString(),
        attachments: [],
        ...ticket
      };
      mockTickets.push(newTicket);
      return delay(newTicket);
    }
  },
  analytics: {
    getStats: async () => {
      return delay({
        totalTickets: 1240,
        resolvedThisWeek: 85,
        avgResponseTime: '2.4h',
        satisfaction: 4.8,
        ticketsByType: [
           { name: 'Price', value: 400 },
           { name: 'Shortage', value: 300 },
           { name: 'Damaged', value: 300 },
           { name: 'Invoice', value: 200 },
        ],
        weeklyTrend: [
          { name: 'Mon', value: 12 },
          { name: 'Tue', value: 19 },
          { name: 'Wed', value: 15 },
          { name: 'Thu', value: 25 },
          { name: 'Fri', value: 32 },
          { name: 'Sat', value: 20 },
          { name: 'Sun', value: 10 },
        ]
      });
    }
  }
};
