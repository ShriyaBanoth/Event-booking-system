# Event Booking System

A full-stack Event Booking System — React (Vite + Tailwind) frontend, Node.js/Express backend, MongoDB database.

## Status: Final Submission Complete ✅

A full-stack Event Booking System built using React, Node.js, Express.js, and MongoDB.

Implemented features include:

- User Authentication (Register, Login, Logout)
- Event Listing & Event Details
- Event Booking & Cancellation
- Atomic Seat Inventory Management
- Reviews & Ratings
- QR Ticket Generation
- Venue Recommendations
- Venue Booking System
- Event Images
- Search, Filtering, Sorting & Pagination
- Validation & Error Handling
- Security Middleware (Helmet, Rate Limiting, Request Logging)

## Project Structure

```
event-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js      # list (search/filter/sort/paginate), get by id, categories
│   │   └── bookingController.js    # create (atomic seat check), cancel, list user bookings
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── bookingRoutes.js        # all routes protected
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── seedEvents.js           # `npm run seed` populates sample events
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── auth.js
    │   │   ├── events.js
    │   │   └── bookings.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── EventCard.jsx
    │   │   ├── EventFilters.jsx     # search + category + sort
    │   │   ├── Pagination.jsx
    │   │   ├── BookingModal.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useDebounce.js       # debounces the events search input
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Events.jsx           # browse/search/filter/paginate
    │   │   ├── EventDetails.jsx     # booking flow
    │   │   └── MyBookings.jsx       # view + cancel
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
## Additional Features & Enhancements

### Reviews & Ratings
Users can submit ratings and reviews for events. Average ratings and review counts are displayed on event pages.

### Venue Recommendations
Venue recommendations are generated based on city, guest count, and event type.

### Venue Booking System
Users can directly book recommended venues through the platform.

### QR Ticket Generation
Each booking generates a QR-based ticket for event verification.

### Event Images
Events display category-specific images for a better user experience.

### Security Features
- JWT Authentication
- Password Hashing (bcrypt)
- Helmet Security Middleware
- Rate Limiting
- Centralized Error Handling
- Request Tracking IDs

### User Experience Improvements
- Toast Notifications
- Loading States
- Empty States
- Responsive Design

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI to your MongoDB Atlas connection string, and JWT_SECRET to a random string
npm run dev
```

Populate the database with sample events (recommended before testing the frontend):

```bash
npm run seed
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

### Event Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List events — supports `search`, `category`, `sort`, `page`, `limit` query params |
| GET | `/api/events/categories` | Public | List distinct categories (for filter dropdown) |
| GET | `/api/events/:id` | Public | Get a single event's details |

**Example:**
```
GET /api/events?search=music&category=Music&sort=date_asc&page=1&limit=9
```
Response `200`:
```
{
  "success": true,
  "data": {
    "events": [ { "_id": "...", "name": "...", "availableSeats": 195, ... } ],
    "pagination": { "page": 1, "limit": 9, "total": 23, "totalPages": 3 }
  }
}
```
`sort` accepts: `date_asc`, `date_desc`, `name_asc`, `name_desc`, `price_asc`, `price_desc`.

### Booking Endpoints

All booking routes require `Authorization: Bearer <jwt>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking — body: `{ "eventId": "...", "seats": 2 }` |
| GET | `/api/bookings` | List the logged-in user's bookings |
| DELETE | `/api/bookings/:id` | Cancel a booking and release seats back to the event |

**Create booking** response `201`:
```
{ "success": true, "message": "Booking confirmed", "data": { "booking": { "_id": "...", "seats": 2, "status": "confirmed", "event": {...} } } }
```

If there aren't enough seats left, the request fails with `400` and a message stating how many seats remain — the check and the seat decrement happen atomically in a single database operation, so two simultaneous bookings can't overbook the same event.

## Design Decisions (Phase 2)

- **Stateless JWT auth**: tokens are signed with `JWT_SECRET` and carry a 7-day expiry by default. `POST /api/auth/logout` exists for REST completeness, but logout is primarily client-side (discarding the token from `localStorage`) since JWTs can't be invalidated server-side without a blacklist — not needed at this stage.
- **Password security**: passwords are hashed with bcrypt (10 salt rounds) via a Mongoose `pre("save")` hook, and the field is `select: false` by default so it's never accidentally returned in API responses, including from `req.user` in protected routes.
- **Validation before DB access**: `express-validator` rules run before any controller logic touches Mongoose, so bad input never reaches the database layer and fails fast with a clear `400`.
- **`asyncHandler` wrapper**: avoids repetitive `try/catch` in every controller — errors thrown inside async route handlers are automatically forwarded to the centralized error middleware from Phase 1.
- **Frontend `AuthContext`**: holds the single source of truth for auth state. On app load, if a token exists in `localStorage`, it's validated against `GET /api/auth/me` so a refresh doesn't lose the session (or silently keep a dead token if it's expired).
- **Axios response interceptor**: any `401` response anywhere in the app clears the stored token automatically, so an expired session can't masquerade as a logged-in UI.
- **`ProtectedRoute`** uses React Router's `<Outlet />` pattern so any number of protected pages can nest under one guard without repeating the auth check.

## Design Decisions (Phase 3 & 4)

- **Atomic seat booking, no transactions needed**: `createBooking` uses a single conditional `findOneAndUpdate({ _id, availableSeats: { $gte: seats } }, { $inc: { availableSeats: -seats } })`. Because the availability check and the decrement happen in one atomic database operation, two concurrent booking requests can't both succeed past the seat limit — this avoids the classic race condition without needing MongoDB multi-document transactions (which also require a replica set, unlike a single conditional update).
- **Cancellation restores inventory**: cancelling a booking sets its status to `cancelled` and increments `availableSeats` back on the event in a separate atomic `$inc`. Bookings are never deleted — they're soft-cancelled, preserving history for the user's "My Bookings" view.
- **Search/filter/sort/pagination server-side**: `GET /api/events` does filtering, sorting, and pagination in MongoDB rather than the client, so the API stays usable as the event catalog grows beyond what's reasonable to ship to the browser in one response.
- **Debounced search input**: the frontend search box uses a custom `useDebounce` hook so a search request only fires 400ms after the user stops typing, rather than on every keystroke.
- **Categories endpoint** (`GET /api/events/categories`) is separate from the main listing endpoint so the filter dropdown can populate independently of the current search/filter state.
- **Booking ownership check**: `cancelBooking` verifies `booking.user` matches the authenticated user before allowing cancellation (`403` otherwise), so one user can't cancel another's booking even with a guessed booking ID.


## Project Highlights

### Authentication
- Register
- Login
- Logout
- Protected Routes

### Event Management
- Event Listing
- Event Details
- Search
- Filtering
- Sorting
- Pagination

### Booking Management
- Seat Booking
- Booking Cancellation
- Seat Restoration
- Booking History

### Venue Management
- Venue Recommendations
- Venue Booking

### Reviews & Feedback
- Ratings
- Reviews

### Technical Features
- REST APIs
- MongoDB Integration
- JWT Authentication
- Validation & Error Handling
- Atomic Seat Inventory Updates
- Security Middleware

## Assumptions

- MongoDB Atlas is used for the database (free-tier cluster is sufficient).
- Node.js v18+ and npm are available locally.
- JWT is stored in `localStorage` on the client; for this assessment's scope, httpOnly cookies were considered but a Bearer-token approach was chosen for simplicity and to keep the API stateless and easy to test (e.g. via curl/Postman) independent of cookie/CORS configuration.
- Logout is treated as a client-side action (token removal); no server-side token blacklist was implemented since it isn't required by the stated scope.
- A maximum of 10 seats can be booked per transaction (UI-enforced) to keep the booking flow simple; this isn't a hard business rule, just a sane default.
- Bookings are soft-cancelled (status flag) rather than deleted, to preserve a user's booking history.
