import { User, UserRole, ChartConfig, ChartDataPoint } from '../types';

const DELAY = 400;

const mockUsers: User[] = [
  { id: 'u1', name: 'John Doe', email: 'consumer@test.com', role: UserRole.CONSUMER },
  { id: 'u2', name: 'Tech Sarah', email: 'tech@test.com', role: UserRole.TECHNICIAN },
  { id: 'u3', name: 'Manager Mike', email: 'manager@test.com', role: UserRole.MANAGER },
  { id: 'u4', name: 'Admin Alice', email: 'admin@test.com', role: UserRole.ADMIN },
  { id: 'u5', name: 'Retailer Bob', email: 'retailer@test.com', role: UserRole.RETAILER, organization: 'Bob\'s Market' },
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
      return delay(mockUsers[0]); 
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
    },
    fetchAnalytics: async (config: Partial<ChartConfig> & { filters?: any }) => {
      // Simulate data processing based on config
      console.log('API: Fetching analytics', config);
      
      const isTimeSeries = ['AREA', 'LINE', 'BAR'].includes(config.type || '') && config.groupBy === 'date';
      const isSector = config.groupBy === 'sector';
      
      let data: ChartDataPoint[] = [];

      // Generate random mock data based on configuration
      if (config.groupBy === 'date' || (!config.groupBy && isTimeSeries)) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = days.map(day => ({
          name: day,
          value: Math.floor(Math.random() * 80) + 20,
          uv: Math.floor(Math.random() * 60) + 10 
        }));
      } else if (isSector) {
        data = [
          { name: 'Retail', value: Math.floor(Math.random() * 500) + 100 },
          { name: 'Logistics', value: Math.floor(Math.random() * 300) + 50 },
          { name: 'Tech', value: Math.floor(Math.random() * 300) + 50 },
          { name: 'Health', value: Math.floor(Math.random() * 200) + 20 },
          { name: 'Finance', value: Math.floor(Math.random() * 100) + 10 },
        ];
      } else if (config.groupBy === 'status') {
        data = [
          { name: 'Open', value: Math.floor(Math.random() * 100) },
          { name: 'In Progress', value: Math.floor(Math.random() * 80) },
          { name: 'Resolved', value: Math.floor(Math.random() * 200) },
          { name: 'Closed', value: Math.floor(Math.random() * 50) },
        ];
      } else if (config.groupBy === 'priority') {
        data = [
          { name: 'Low', value: 45 },
          { name: 'Medium', value: 80 },
          { name: 'High', value: 35 },
          { name: 'Critical', value: 12 },
        ];
      } else if (config.groupBy === 'technician') {
        data = [
          { name: 'Sarah', value: 45 },
          { name: 'Mike', value: 32 },
          { name: 'John', value: 28 },
          { name: 'Alice', value: 15 },
        ];
      } else {
        // Fallback
        data = [
          { name: 'A', value: 400 },
          { name: 'B', value: 300 },
          { name: 'C', value: 300 },
          { name: 'D', value: 200 },
        ];
      }

      // Simulate filter impact (reduce values if filters applied)
      if (config.filters && Object.keys(config.filters).length > 0) {
        data = data.map(d => ({ ...d, value: Math.floor(d.value * 0.7) }));
      }

      return delay(data);
    }
  }
};