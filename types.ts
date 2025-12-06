export enum UserRole {
  GUEST = 'GUEST',
  CONSUMER = 'CONSUMER',
  RETAILER = 'RETAILER',
  WHOLESALER = 'WHOLESALER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  TECHNICIAN = 'TECHNICIAN',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketType {
  PRICE_MANIPULATION = 'Price Manipulation',
  PRODUCT_SHORTAGE = 'Product Shortage',
  SHIPMENT_ISSUE = 'Shipment Issue',
  DAMAGED_GOODS = 'Damaged Goods',
  INCORRECT_INVOICE = 'Incorrect Invoice',
  GENERAL_INQUIRY = 'General Inquiry',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  phone?: string;
  sector?: string;
}

export interface Ticket {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  creatorId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // ISO Date string
  attachments: string[]; // URLs
  location?: string;
  sector?: string;
  service?: string;
}

export interface TimelineItem {
  id: string;
  type: 'STATUS_CHANGE' | 'COMMENT' | 'ASSIGNMENT' | 'FILE_UPLOAD';
  content: string;
  userId: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  attachments?: string[];
  isThinking?: boolean;
  actionRequired?: boolean;
}

export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}
