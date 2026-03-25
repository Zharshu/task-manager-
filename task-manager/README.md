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
- **Custom Modals & Spinners**: Avoided native browser `window.confirm` dialogues by building premium React UI modals. Implemented centered, full-screen Lucide React Loading Spinners for all asynchronous data fetching to drastically improve perceived performance.
- **Complete Responsiveness**: Custom utility classes selectively handle layouts for smaller devices (horizontal scrolling for tables, wrapping flexboxes, hidden non-essential navbar text) keeping the Desktop UI flawless while actively supporting mobile.
- **Dark Mode**: A fully featured dark mode toggle using React State and CSS variable injection, persisting across reloads.

### 3. State Management & Performance
- **Zustand State Management**: Lightweight, decoupled state stores for Authentication, Tasks, and Theme preferences, entirely avoiding prop-drilling or bulky Redux boilerplates.
- **API Optimization**: Applied manual query optimization and pagination filtering mapping to MongoDB queries.

### 4. Bonus Features
- ⚡ **Real-time Updates (Socket.io)**: A robust WebSocket implementation broadcasted globally. When a Manager assigns or updates a task, all connected clients instantly receive the live DOM update without polling.
- 🖱️ **Drag-and-Drop Kanban**: Implemented using `@hello-pangea/dnd` for fluid, physics-based dragging. Status updates immediately sync with the database and bounce across WebSockets.
- 📄 **Pagination**: Endpoint APIs (`/api/tasks`) accept `page` and `limit` queries to optimize heavy loads.
- 🌟 **AI Integration (OpenAI Smart Rewrite)**: Connected the `gpt-3.5-turbo` API to the Task Creation form to automatically rewrite user task descriptions into clean, professional content.
- 🎙️ **AI Integration (Speech-to-Text)**: Added native `SpeechRecognition` Browser APIs to allow managers to dictate task instructions via microphone, converting them to text instantly.

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

### Bonus AI Feature Implementations
To demonstrate creativity and integration skills, this application features native AI integrations directly inside the Task Creation workflow:

1. **OpenAI Smart Rewrite (`gpt-3.5-turbo`)**: A "Sparkles" button inside the Task Description box seamlessly pipes raw user input to a Node.js API endpoint connected to OpenAI. The model processes the prompt to fix grammar, remove fluff, and instantly replace the raw text with a clean, professional, and actionable task description.
2. **Native Speech-to-Text**: A dedicated Microphone button utilizes the `window.SpeechRecognition` Browser API to allow managers to dictate complex task instructions verbally, converting them to text in real-time.

*Note: AI Tooling (Google Gemini Pro) was also utilized during the development lifecycle to rapidly scaffold Mongoose models and refine the CSS Custom Variable aesthetic framework.*
