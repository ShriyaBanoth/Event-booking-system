# Event Booking System

A full-stack Event Booking System — React (Vite + Tailwind) frontend, Node.js/Express backend, MongoDB database.

## Status: Phase 1 — Project Setup & Architecture ✅

This phase establishes the foundation: folder structure, server, database connection, and frontend build pipeline. Authentication, events, and bookings are implemented in later phases.

## Project Structure

```
event-booking-system/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (added in later phases)
│   ├── middleware/       # Error handling, auth (added in later phases)
│   ├── models/           # Mongoose schemas (added in later phases)
│   ├── routes/           # Express routers (added in later phases)
│   ├── utils/             # Helpers, seed scripts
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/           # Centralized Axios client
    │   ├── components/   # Reusable UI components (added in later phases)
    │   ├── context/       # React context (auth, etc. — later phases)
    │   ├── hooks/          # Custom hooks (later phases)
    │   ├── pages/          # Route-level pages (later phases)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Axios, React Router, react-hot-toast
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (Atlas recommended)
- **Auth (Phase 2):** JWT + bcrypt

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI to your MongoDB Atlas connection string, and JWT_SECRET to a random string
npm run dev
```

The API runs on `http://localhost:5000`. Verify it's alive:

```bash
curl http://localhost:5000/api/health
# {"success":true,"message":"API is running"}
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`. The dev server proxies `/api/*` requests to `http://localhost:5000`, so no CORS configuration is needed locally.

Open the app — it should show a green "Connected" status if the backend is running, confirming the full stack is wired correctly.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default `5000`) |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (used in production builds; dev uses the Vite proxy) |

## Design Decisions (Phase 1)

- **MongoDB + Mongoose** chosen for flexible event/booking schemas and quick iteration.
- **Centralized error handler** (`middleware/errorMiddleware.js`) set up early so every later route can simply `throw` or call `next(error)` without duplicating error-shaping logic.
- **Tailwind v4** configured via the official `@tailwindcss/vite` plugin (no separate `postcss.config.js`/`tailwind.config.js` needed for v4's CSS-first config).
- **Axios instance with interceptor** (`src/api/axios.js`) created upfront so JWT attachment in Phase 2 requires no refactor — every request automatically carries the token from `localStorage` once auth is implemented.
- **Dev proxy over CORS wildcards**: the Vite proxy forwards `/api` to the backend in development, avoiding CORS friction while keeping the production CORS config explicit via `CLIENT_URL`.

## Next Phases

| Phase | Scope |
|---|---|
| 2 | JWT Authentication (Register, Login, Logout, Protected Routes) |
| 3 | Event Management (List, Details, Search, Sort) |
| 4 | Booking System (Create, View, Cancel, Seat Inventory) |
| 5 | Production UX (Toasts, Loading/Empty States, Responsive Design) |
| 6 | Startup Enhancements (Categories, Pagination, Filters) |
| 7 | Deployment (Render + Vercel) & Final README |

## Assumptions

- MongoDB Atlas is used for the database (free-tier cluster is sufficient).
- Node.js v18+ and npm are available locally.
