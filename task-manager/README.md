# TaskFlow — Collaborative Task Manager

A full-stack task management application built with React, Node.js, Express, and MongoDB. 

This project perfectly fulfills all core requirements and **all bonus challenges** for the assessment, including JWT authentication, Role-Based Access Control (RBAC), real-time WebSocket updates, drag-and-drop Kanban functionality, and paginated API endpoints.

---

## 🎯 Features Implemented (Evaluation Criteria)

### 1. API Security & Backend Architecture
- **JWT Authentication**: Secure signup and login with stateless JWT session management.
- **Role-Based Access Control (RBAC)**:
  - **Manager**: Complete CRUD permissions. Can create, edit, assign, and delete tasks.
  - **User**: Restricted access. Can only view tasks assigned to them and update task statuses.
- **Rate Limiting**: Configured via `express-rate-limit` to prevent spam API requests and brute-force auth attempts.
- **Activity Logs**: All task state changes are explicitly logged and stored in a separate `ActivityLog` MongoDB collection.

### 2. UI Design & Responsiveness 
- **Premium Interface**: A modern, glassmorphic UI utilizing strict CSS custom variables to guarantee perfect paddings, margins, shadows, and hover micro-animations regardless of browser environments.
- **Complete Responsiveness**: Custom utility classes selectively handle layouts for smaller devices (horizontal scrolling for tables, wrapping flexboxes, hidden non-essential navbar text) keeping the Desktop UI flawless while actively supporting mobile.
- **Dark Mode**: A fully featured dark mode toggle using React State and CSS variable injection, persisting across reloads.

### 3. State Management & Performance
- **Zustand State Management**: Lightweight, decoupled state stores for Authentication, Tasks, and Theme preferences, entirely avoiding prop-drilling or bulky Redux boilerplates.
- **API Optimization**: Applied manual query optimization and pagination filtering mapping to MongoDB queries.

### 4. Bonus Features
- ⚡ **Real-time Updates (Socket.io)**: A robust WebSocket implementation broadcasted globally. When a Manager assigns or updates a task, all connected clients instantly receive the live DOM update without polling.
- 🖱️ **Drag-and-Drop Kanban**: Implemented using `@hello-pangea/dnd` for fluid, physics-based dragging. Status updates immediately sync with the database and bounce across WebSockets.
- 📄 **Pagination**: Endpoint APIs (`/api/tasks`) accept `page` and `limit` queries to optimize heavy loads.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) or an Atlas URI

### 1. Clone & Install Dependencies
Open your terminal and install dependencies for both sides:

```bash
# Setup Backend
cd backend
npm install
cp .env.example .env

# Setup Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Start Development Servers
Open two separate terminal windows:

```bash
# Terminal 1 — Backend (Runs on port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (Runs on port 5173)
cd frontend
npm run dev
```

### 3. Creating Test Accounts
1. Navigate to `http://localhost:5173/signup`
2. Create a **Manager** account (Select "Manager" in the role dropdown).
3. Create a **User** account.
4. Log in as the Manager, create tasks, and assign them to the User.
5. Open an Incognito window, log in as the User, and watch the Live WebSocket updates when you drag-and-drop!

---

## 🤖 AI Model Documentation

### AI Usage in Development
This application does not feature user-facing AI models inside the app (e.g., text generation APIs). However, AI tooling (Google Gemini Pro / Antigravity Agentic architecture) was utilized during the *development lifecycle* to:

1. **Scaffold Boilerplates**: Rapidly generate the Express.js routing structures, Mongoose models, and React context hooks.
2. **Refine CSS Aesthetics**: Iteratively transform standard Tailwind structures into the highly-customized, responsive, custom-CSS-variable layout to ensure pixel-perfect fidelity and robust dark mode toggling.
3. **Debug WebSockets**: Resolve race conditions regarding React strict-mode double-mounting with Socket.io listeners.

All generated logic was strictly reviewed to ensure it enforces proper RESTful patterns, avoids anti-patterns, and maintains high enterprise security standards.

---

## 📹 Demo Submission Reminder
*Note to candidate: Ensure you record your 5-minute screen-share video walking through the web app, explaining the functionality, design choices, and AI integration as specified in the assignment prompt before submitting!*
