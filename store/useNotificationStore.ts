import { create } from 'zustand';
import { Notification } from '../types';
import { withLocalStoragePersist } from './persist';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>(
  withLocalStoragePersist(
    (set) => ({
      notifications: [
        {
          id: 'n1',
          userId: 'u1',
          title: 'Ticket Assigned',
          message: 'Ticket REF-2023-002 has been assigned to you.',
          type: 'INFO',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/tickets/t2'
        },
        {
          id: 'n2',
          userId: 'u1',
          title: 'SLA Warning',
          message: 'Ticket REF-2023-001 is approaching deadline.',
          type: 'WARNING',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          link: '/tickets/t1'
        }
      ],
      unreadCount: 2,

      addNotification: (data) => set((state) => {
        const newNotif: Notification = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          read: false,
        };
        return {
          notifications: [newNotif, ...state.notifications],
          unreadCount: state.unreadCount + 1
        };
      }),

      markAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.read).length
        };
      }),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }))
    }),
    'notification_store',
    (state) => ({
      notifications: state.notifications,
      unreadCount: state.unreadCount
    })
  )
);
