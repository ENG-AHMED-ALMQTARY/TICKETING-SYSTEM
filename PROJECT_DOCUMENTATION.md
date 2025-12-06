
# Smart Product Ticketing & Market Oversight System - Documentation

**Version:** 1.1.0
**Tech Stack:** React 19, TypeScript, Zustand, Tailwind CSS, Framer Motion, Recharts, Gemini AI, jsPDF, html2canvas.

---

## 1. Project Overview

The **Smart Product Ticketing & Market Oversight System** is an enterprise-grade web application designed to monitor market irregularities (price manipulation, product shortages, damaged goods) and facilitate issue resolution between consumers, retailers, and technicians.

It features a role-based architecture, a persistent AI assistant that bridges unauthenticated and authenticated sessions, and a fully dynamic analytics engine with export capabilities.

---

## 2. Technical Architecture

### 2.1 Core Framework
*   **React 19:** Utilizes the latest React features including functional components and hooks.
*   **TypeScript:** Strict typing is enforced across the entire application to ensure reliability.
*   **Vite:** (Implied) Used as the build tool for fast HMR.

### 2.2 State Management (Zustand)
The application uses **Zustand** for global state management with a custom `withLocalStoragePersist` middleware.

**Active Stores:**
1.  `useAuthStore`: Manages user session, login status, and role.
2.  `useTicketStore`: Manages ticket CRUD, **Advanced Filtering**, pagination, and timeline.
3.  `useChatbotStore`: Manages chat history, **Context**, and Guest Flow.
4.  `useNotificationStore`: Manages alerts and read/unread counts.
5.  `useAnalyticsStore`: Manages custom chart configurations and dashboard filters.
6.  `useLanguageStore`: Manages active language (`en`/`ar`) and direction (`ltr`/`rtl`).

### 2.3 Styling & UI
*   **Tailwind CSS:** Utility-first styling.
*   **Design Tokens:** Defined in `index.html`.
*   **Glassmorphism:** Extensive use of semi-transparent backgrounds.
*   **Animation:** **Framer Motion** for transitions.
*   **RTL Support:** The entire UI flips dynamically based on the selected language.

### 2.4 AI Integration
*   **Google Gemini 2.5 Flash:** The chatbot communicates with the Gemini API via `services/chatbotApi.ts`.
*   **Context Injection:** The app feeds the current page context (e.g., "Viewing Ticket #123") into the system prompt, allowing the AI to answer context-specific questions.

---

## 3. Key Features & Modules

### 3.1 The AI Assistant (Chatbot)
Located in `components/chatbot/ChatWidget.tsx`.

*   **Dual Mode Operation:** Guest (Scripted Draft) vs. Authenticated (Gemini AI).
*   **Context Awareness:** The bot is aware of the current route and specific data (Ticket ID, Status) being viewed.
*   **Multi-Modal Input:** Voice (Web Speech API) and Image Upload.

### 3.2 Dynamic Analytics Engine & Reporting
Located in `pages/analytics/` and `src/utils/exportUtils.ts`.

*   **Chart Builder:** WYSIWYG editor for creating custom visualizations (Area, Bar, Line, Pie, Radar).
*   **Export Capabilities:**
    *   **CSV:** Exports raw dataset of any chart.
    *   **PDF:** Generates a professional report containing a high-res image of the chart (via `html2canvas`) and a data summary table (via `jspdf`).
*   **Live Preview:** Real-time data fetching during chart configuration.

### 3.3 Ticketing System & Advanced Filtering
Located in `pages/tickets/` and `services/ticketsApi.ts`.

*   **Server-Side Simulation:** The `getTickets` API method simulates complex backend queries:
    *   **Full Text Search:** Filters by title, description, or reference ID.
    *   **Multi-Select Filters:** Supports multiple Statuses and Priorities simultaneously.
    *   **Date Range:** Filters by creation date.
    *   **Pagination:** Handles page size and current page offsets.
*   **SLA Tracking:** Visual indicators for deadline proximity.
*   **Timeline:** Unified history view of all ticket activities.

### 3.4 Internationalization (i18n)
Located in `src/i18n/` and `src/store/useLanguageStore.ts`.

*   **Dictionary System:** Simple JSON-based translation maps (`en.ts`, `ar.ts`).
*   **Direction Control:** Toggling language automatically updates the `dir` attribute on the `<html>` tag, triggering Tailwind's `rtl:` modifiers.

---

## 4. Page Reference

### 4.1 Public Pages
*   **Landing Page (`/`):** Hero section, Live Metrics, Language Toggle.
*   **Authentication (`/login`):** Login form with test accounts.

### 4.2 Protected Pages (Dashboard Layout)
*   **Dashboard (`/dashboard`):** KPI Grid, Default Charts.
*   **Ticket List (`/tickets`):**
    *   **Filter Bar:** Collapsible panel for advanced filtering criteria.
    *   **Active Filters:** Chip display for quick removal of active filters.
    *   **Pagination:** Next/Prev controls.
*   **Ticket Detail (`/tickets/:id`):** SLA Timer, Assignee, Attachments, Timeline.
*   **Analytics (`/analytics`):** Grid of charts with Export options.
*   **Admin User Management (`/admin`):** CRUD operations for users.

---

## 5. Data Models (Types)

### 5.1 User
```typescript
interface User {
  id: string;
  name: string;
  role: UserRole;
  // ...
}
```

### 5.2 Ticket & Filtering
```typescript
interface TicketFilterParams {
  q?: string;
  status?: TicketStatus[];
  priority?: string[];
  dateFrom?: string;
  // ...
}
```

---

## 6. Mock Data Strategy

The application uses a simulated backend in `services/mockApi.ts` and `services/ticketsApi.ts`.
*   **Latency:** Configurable delay (default 400-600ms).
*   **Dynamic Generation:** `ticketsApi` generates 50+ mock tickets to demonstrate pagination and filtering effectiveness.

---

## 7. Security & Permissions

*   **Route Protection:** `ProtectedRoute` wrapper.
*   **Component Visibility:** UI elements (like "Delete User" or "Create Chart") are conditionally rendered based on `UserRole`.

---

## 8. Setup & Usage

1.  **Login:** Use `admin@test.com`.
2.  **Explore Tickets:** Use the filter bar in "Tickets" to search for specific issues.
3.  **Analytics:** Create a custom chart, then click the "Export" menu on the card to download a PDF report.
4.  **Chat:** Ask the bot "What is the status of this ticket?" while viewing a ticket detail page.
5.  **Language:** Toggle the globe icon in the header to switch between English and Arabic.
