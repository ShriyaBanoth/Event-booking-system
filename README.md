# Event Booking System

A full-stack Event Booking System — React (Vite + Tailwind) frontend, Node.js/Express backend, MongoDB database.

## Status: Phase 2 — JWT Authentication ✅

Phase 1 (project setup) and Phase 2 (authentication) are complete. Users can register, log in, log out, and access protected routes (frontend and backend) using a JWT issued on login/registration.

## Project Structure

```
event-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── authController.js      # register, login, logout, getMe
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification ("protect")
│   │   ├── errorMiddleware.js     # Centralized error handling
│   │   └── validators.js          # express-validator rules
│   ├── models/
│   │   └── User.js                # User schema (bcrypt hashing built in)
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js           # Axios instance + JWT interceptor
    │   │   └── auth.js            # register/login/logout/getMe calls
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx # Route guard
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state, login/register/logout
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx      # Protected placeholder page
    │   ├── App.jsx                # Router setup
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

## API Documentation

### Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| POST | `/api/auth/logout` | Private | Logout (client discards token) |
| GET | `/api/auth/me` | Private | Get current authenticated user |

**Register**
```
POST /api/auth/register
Content-Type: application/json

{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```
Response `201`:
```
{ "success": true, "message": "Registration successful", "data": { "user": {...}, "token": "<jwt>" } }
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "secret123" }
```
Response `200`: same shape as register.

**Protected requests** — include the token from register/login:
```
Authorization: Bearer <jwt>
```

Error responses follow a consistent shape: `{ "success": false, "message": "..." }` (HTTP 400 for validation errors, 401 for auth failures).

## Design Decisions (Phase 2)

- **Stateless JWT auth**: tokens are signed with `JWT_SECRET` and carry a 7-day expiry by default. `POST /api/auth/logout` exists for REST completeness, but logout is primarily client-side (discarding the token from `localStorage`) since JWTs can't be invalidated server-side without a blacklist — not needed at this stage.
- **Password security**: passwords are hashed with bcrypt (10 salt rounds) via a Mongoose `pre("save")` hook, and the field is `select: false` by default so it's never accidentally returned in API responses, including from `req.user` in protected routes.
- **Validation before DB access**: `express-validator` rules run before any controller logic touches Mongoose, so bad input never reaches the database layer and fails fast with a clear `400`.
- **`asyncHandler` wrapper**: avoids repetitive `try/catch` in every controller — errors thrown inside async route handlers are automatically forwarded to the centralized error middleware from Phase 1.
- **Frontend `AuthContext`**: holds the single source of truth for auth state. On app load, if a token exists in `localStorage`, it's validated against `GET /api/auth/me` so a refresh doesn't lose the session (or silently keep a dead token if it's expired).
- **Axios response interceptor**: any `401` response anywhere in the app clears the stored token automatically, so an expired session can't masquerade as a logged-in UI.
- **`ProtectedRoute`** uses React Router's `<Outlet />` pattern so any number of protected pages can nest under one guard without repeating the auth check.


## Next Phases

| Phase | Scope |
|---|---|
| 3 | Event Management (List, Details, Search, Sort) |
| 4 | Booking System (Create, View, Cancel, Seat Inventory) |
| 5 | Production UX (Toasts, Loading/Empty States, Responsive Design) |
| 6 | Startup Enhancements (Categories, Pagination, Filters) |
| 7 | Deployment (Render + Vercel) & Final README |

## Assumptions

- MongoDB Atlas is used for the database (free-tier cluster is sufficient).
- Node.js v18+ and npm are available locally.
- JWT is stored in `localStorage` on the client; for this assessment's scope, httpOnly cookies were considered but a Bearer-token approach was chosen for simplicity and to keep the API stateless and easy to test (e.g. via curl/Postman) independent of cookie/CORS configuration.
- Logout is treated as a client-side action (token removal); no server-side token blacklist was implemented since it isn't required by the stated scope.
