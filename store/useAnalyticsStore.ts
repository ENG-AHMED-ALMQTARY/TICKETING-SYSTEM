import { create } from 'zustand';
import { ChartConfig, UserRole } from '../types';
import { api } from '../services/mockApi';
import { withLocalStoragePersist } from './persist';

interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  sector?: string;
  service?: string;
}

interface AnalyticsState {
  charts: ChartConfig[];
  filters: AnalyticsFilters;
  isLoading: boolean;
  data: any; 

  loadCharts: () => Promise<void>;
  addChart: (config: Omit<ChartConfig, 'id'>) => void;
  updateChart: (id: string, config: Partial<ChartConfig>) => void;
  removeChart: (id: string) => void;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  applyFilters: () => Promise<void>;
}

const DEFAULT_CHARTS: ChartConfig[] = [
  {
    id: 'default-1',
    title: 'Weekly Ticket Trend',
    type: 'AREA',
    metric: 'tickets_count',
    dataSource: 'tickets',
    groupBy: 'date',
    granularity: 'daily',
    visibility: [UserRole.ADMIN, UserRole.MANAGER],
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    title: 'Tickets by Sector',
    type: 'BAR',
    metric: 'tickets_count',
    dataSource: 'tickets',
    groupBy: 'sector',
    visibility: [UserRole.ADMIN, UserRole.MANAGER],
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-3',
    title: 'Status Distribution',
    type: 'PIE',
    metric: 'tickets_count',
    dataSource: 'tickets',
    groupBy: 'status',
    visibility: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN],
    createdBy: 'system',
    createdAt: new Date().toISOString()
  }
];

export const useAnalyticsStore = create<AnalyticsState>(
  withLocalStoragePersist(
    (set, get) => ({
      charts: [],
      filters: {},
      isLoading: false,
      data: null,

      loadCharts: async () => {
        const currentCharts = get().charts;
        if (currentCharts.length === 0) {
           set({ charts: DEFAULT_CHARTS });
        }
      },

      addChart: (config) => set((state) => ({
        charts: [
          ...state.charts,
          { ...config, id: `chart-${Date.now()}` } as ChartConfig
        ]
      })),

      updateChart: (id, config) => set((state) => ({
        charts: state.charts.map(c => c.id === id ? { ...c, ...config } : c)
      })),

      removeChart: (id) => set((state) => ({
        charts: state.charts.filter(c => c.id !== id)
      })),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),

      applyFilters: async () => {
        set({ isLoading: true });
        try {
          const filters = get().filters;
          const result = await api.analytics.fetchAnalytics(filters);
          set({ data: result, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch analytics", error);
          set({ isLoading: false });
        }
      }
    }),
    'analytics_store',
    (state) => ({
      charts: state.charts 
    })
  )
);