
# Smart Product Ticketing & Market Oversight System - Documentation

**Version:** 1.0.0
**Tech Stack:** React 19, TypeScript, Zustand, Tailwind CSS, Framer Motion, Recharts, Gemini AI.

---

## 1. Project Overview

The **Smart Product Ticketing & Market Oversight System** is an enterprise-grade web application designed to monitor market irregularities (price manipulation, product shortages, damaged goods) and facilitate issue resolution between consumers, retailers, and technicians.

It features a role-based architecture, a persistent AI assistant that bridges unauthenticated and authenticated sessions, and a fully dynamic analytics engine.

---

## 2. Technical Architecture

### 2.1 Core Framework
*   **React 19:** Utilizes the latest React features including functional components and hooks.
*   **TypeScript:** Strict typing is enforced across the entire application to ensure reliability.
*   **Vite:** (Implied) Used as the build tool for fast HMR.

### 2.2 State Management (Zustand)
The application uses **Zustand** for global state management. A custom higher-order function `withLocalStoragePersist` is implemented to automatically persist specific stores to the browser's `localStorage`. This ensures that user sessions, drafted tickets, and chart configurations survive page reloads.

**Active Stores:**
1.  `useAuthStore`: Manages user session, login status, and role.
2.  `useTicketStore`: Manages ticket CRUD operations, timeline history, and current selection.
3.  `useChatbotStore`: Manages chat history, AI interaction state, and Guest Flow drafts.
4.  `useNotificationStore`: Manages alerts and read/unread counts.
5.  `useAnalyticsStore`: Manages custom chart configurations and dashboard filters.

### 2.3 Styling & UI
*   **Tailwind CSS:** Utility-first styling.
*   **Design Tokens:** Defined in `index.html` (Colors: Slate/Indigo/Purple, Fonts: Inter/DM Sans).
*   **Glassmorphism:** The UI relies heavily on semi-transparent backgrounds (`bg-slate-900/50`, `backdrop-blur-xl`) to create a modern, high-tech aesthetic.
*   **Animation:** **Framer Motion** is used for page transitions, modal popups, and list reordering.

### 2.4 AI Integration
*   **Google Gemini 2.5 Flash:** The chatbot communicates with the Gemini API for natural language processing.
*   **Service Layer:** `services/chatbotApi.ts` handles the API handshake. It includes fallback logic to mock responses if no API key is present in the environment.

---

## 3. Key Features & Modules

### 3.1 The AI Assistant (Chatbot)
Located in `components/chatbot/ChatWidget.tsx`, this is a persistent global widget.

*   **Dual Mode Operation:**
    *   **Guest Mode:** For unauthenticated users, the bot enters a scripted "State Machine" flow (`NAME` -> `PHONE` -> `SECTOR` -> `DESCRIPTION`). It collects data to draft a ticket.
    *   **Authenticated Mode:** Once logged in, the bot acts as a general assistant powered by Gemini, capable of answering context-aware questions.
*   **Guest Ticket Claiming:** If a guest drafts a ticket and then logs in, `App.tsx` detects the `guest_ticket` in localStorage and triggers the `GuestClaimModal`. This allows the user to convert their anonymous chat into a real system ticket.
*   **Multi-Modal Input:**
    *   **Voice:** Uses the Web Speech API (`VoiceRecorder.tsx`) to transcribe speech to text.
    *   **Image:** Allows file selection (`ImageUploader.tsx`), rendering previews in the chat bubble.

### 3.2 Dynamic Analytics Engine
Located in `pages/analytics/` and `store/useAnalyticsStore.ts`.

*   **Analytics Page:** Displays a grid of customizable charts. Includes global filters for Sector and Date Range that cascade down to all charts.
*   **Chart Builder:** A WYSIWYG editor (`AnalyticsBuilder.tsx`) allowing Managers/Admins to create custom visualizations.
    *   **Create Mode:** Opens with default values.
    *   **Edit Mode:** Preloads existing chart configuration.
*   **Configuration:** Users can select:
    *   **Type:** Area, Bar, Line, Pie, Radar.
    *   **Metric:** Ticket counts, Satisfaction, Response time.
    *   **Grouping:** By Date, Sector, Status, Priority, Technician.
    *   **Visibility:** Role-based access control (e.g., restrict a chart to Admins only).
*   **Live Preview:** The builder fetches mock data in real-time (`ChartPreview.tsx`) to show how the chart will look before saving.
*   **Persistence:** Created charts are saved to localStorage, allowing users to build a personalized dashboard that persists across sessions.

### 3.3 Ticketing System
Located in `pages/tickets/`.

*   **SLA Tracking:** The `SLAIndicator` component visually displays time remaining vs. the deadline. It changes color (Green -> Orange -> Red) as the deadline approaches.
*   **Timeline:** A unified history view (`TicketTimeline.tsx`) combining:
    *   Status Changes.
    *   User Comments.
    *   File Uploads.
    *   Assignee Changes.
*   **Optimistic Updates:** The UI updates immediately while the `ticketsApi` simulates network delay.

---

## 4. Page Reference

### 4.1 Public Pages
*   **Landing Page (`/`):**
    *   Features a hero section with animated background gradients.
    *   Displays live system metrics (Active Tickets, Resolution Rate).
    *   Includes a "Start Guest Chat" CTA.
*   **Authentication (`/login`):**
    *   A simulated login form.
    *   Lists available test accounts for easy demo access.

### 4.2 Protected Pages (Dashboard Layout)
*   **Dashboard (`/dashboard`):**
    *   **KPI Grid:** High-level metrics (Total Tickets, Avg Response).
    *   **Default Charts:** Trend Analysis and Ticket Distribution.
    *   **Role-Specific Content:** Shows specific alerts for Technicians (e.g., "Active Assignment").
*   **Ticket List (`/tickets`):**
    *   Search bar (filters by Title/Reference).
    *   Grid view of `TicketCard` components.
*   **Ticket Create (`/tickets/create`):**
    *   Form validation for Title, Priority, Type, and Description.
*   **Ticket Detail (`/tickets/:id`):**
    *   **Header:** Status badges, Priority indicators.
    *   **Actions:** Update Status (Role-protected), Share.
    *   **Tabs/Grid:** Description, Attachments, SLA Timer, Assignee info, and Activity Timeline.
*   **Analytics (`/analytics`):**
    *   Renders the grid of configured charts.
    *   "Custom Chart" button opens the Builder Modal.
*   **Notifications (`/notifications`):**
    *   Tabs for "All" vs "Unread".
    *   Clicking a notification marks it as read and navigates to the relevant resource.
*   **Admin User Management (`/admin`):**
    *   **Table View:** Lists users with avatars, roles, and contact info.
    *   **CRUD Actions:** Modals for Creating, Editing, and Deleting users.
    *   **Search:** filter users by name/email/role.

---

## 5. Data Models (Types)

### 5.1 User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'GUEST' | 'CONSUMER' | 'RETAILER' | 'TECHNICIAN' | 'MANAGER' | 'ADMIN';
  // ...
}
```

### 5.2 Ticket
```typescript
interface Ticket {
  id: string;
  referenceNumber: string; // e.g., REF-2023-001
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  slaDeadline: string; // ISO Date
  // ...
}
```

### 5.3 ChartConfig
```typescript
interface ChartConfig {
  id: string;
  title: string;
  type: 'AREA' | 'BAR' | 'PIE' | 'LINE' | 'RADAR';
  metric: string;
  groupBy: string; // 'date' | 'sector' | 'status'
  visibility: UserRole[]; // Who can see this chart
  filters?: Record<string, any>;
  // ...
}
```

---

## 6. Mock Data Strategy

The application uses a simulated backend in `services/mockApi.ts`.
*   **Latency:** All API calls have a configurable delay (default 600ms) to simulate real-world network conditions and demonstrate loading states.
*   **Data Generation:** The analytics API generates realistic-looking random data based on the requested `ChartConfig` (e.g., if grouping by 'sector', it returns categorical data; if by 'date', it returns time-series data).

---

## 7. Security & Permissions

*   **Route Protection:** `App.tsx` wraps protected routes in a `<ProtectedRoute>` component that checks `useAuthStore.isAuthenticated`.
*   **Component Visibility:**
    *   The **Sidebar** filters navigation links based on the user's role.
    *   **Analytics Builder** is only accessible to Admin/Manager.
    *   **Status Updates** on tickets are hidden from Consumers.

---

## 8. Setup & Usage

1.  **Login:** Use any of the test accounts (e.g., `admin@test.com`, `manager@test.com`).
2.  **Create Data:** Go to Tickets -> Create to add data to the store.
3.  **Analyze:** Go to Analytics -> Custom Chart to build visualizations based on the data.
4.  **Admin:** Go to Admin to manage the user base.
5.  **Reset:** To clear all data and persisted state, click the "Reset" (Rotate Icon) button in the Header.
