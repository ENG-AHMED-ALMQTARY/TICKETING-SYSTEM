import { User, UserRole, CreateUserPayload, UpdateUserPayload } from '../types';

// Mock Data
let MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'consumer@test.com', role: UserRole.CONSUMER, phone: '555-0101', sector: 'Retail' },
  { id: '2', name: 'Sarah Tech', email: 'tech@test.com', role: UserRole.TECHNICIAN, phone: '555-0102', sector: 'IT Support' },
  { id: '3', name: 'Mike Manager', email: 'manager@test.com', role: UserRole.MANAGER, phone: '555-0103', sector: 'Logistics' },
  { id: '4', name: 'Alice Admin', email: 'admin@test.com', role: UserRole.ADMIN, phone: '555-0104' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminApi = {
  getUsers: async (): Promise<User[]> => {
    await delay(600);
    return [...MOCK_USERS];
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    await delay(800);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...payload,
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    await delay(600);
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...payload };
    return MOCK_USERS[index];
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(600);
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  }
};