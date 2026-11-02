# 🏨 HotelPro - Complete Hotel Booking & Management Solution

HotelPro is a full-stack hospitality and hotel management platform designed to streamline hotel operations, guest reservations, room inventory tracking, and payment workflows. Built on the **MERN** stack (MongoDB, Express.js, React, Node.js) with **Bootstrap 5** and secured by **JSON Web Tokens (JWT)**.

---

## 🌟 Mentor Review & Evaluation Quick Links

| Deliverable | URL |
|---|---|
| **GitHub Repository** | https://github.com/dhanshree1414/hotelpro |
| **Live Demo Application** | https://dive-dosage-understood-instructional.trycloudflare.com |

### 🔑 Demo Accounts for Evaluation
- **Hotel Administrator:**
  - **Email:** `admin@hotelpro.com`
  - **Password:** `adminpassword123`
  - *(Access to dashboard metrics, revenue reports, room creation/deletion, and booking status management)*
- **Guest Account:**
  - **Email:** `guest@hotelpro.com`
  - **Password:** `guestpassword123`
  - *(Access to room booking, stay history, and invoice printing)*

---

## 📋 The 6 Epics & Features Breakdown

### Epic 1: Authentication & Role-Based Authorization
- **JWT Protection:** Secure user authentication with encrypted tokens and bcrypt password hashing.
- **Roles:** Separate privileges for `guest` (booking & view stays) and `admin` (management portal).
- **Session State:** Persistent user sessions managed via React `AuthContext` and Axios interceptors.

### Epic 2: Room Inventory & Management
- Comprehensive room attributes: Room Number, Room Type, Capacity, Bed Type, Size (sq ft), Amenities list, Photo galleries, and Nightly Rates.
- **Admin CRUD:** Staff can add new rooms to inventory, edit parameters, and delete rooms.

### Epic 3: Search, Filter & Room Discovery Engine
- **Multi-Factor Filtering:** Filter rooms by category (Standard, Deluxe, Executive Suite, Presidential Suite, Family Suite).
- **Price Range Slider:** Dynamic filtering up to \$800/night.
- **Capacity & Date Check:** Real-time checking to prevent double-booking for overlapping check-in/out dates.

### Epic 4: Reservation & Booking System
- Seamless booking workflow with automatic nights and tax calculations.
- Guest details auto-population for logged-in users.
- Special requests handling (e.g. high floor, late check-in).
- Booking lifecycle tracking: `Confirmed`, `Checked-In`, `Checked-Out`, and `Cancelled`.

### Epic 5: Payment Processing Simulation & Invoicing
- Integrated checkout simulator with itemized pricing breakdown (base rate × nights + hospitality tax).
- Instant reservation confirmation.
- Printable invoice and receipt generation from the "My Bookings" page.

### Epic 6: Hotel Operations & Admin Dashboard
- **Executive Metrics:** Total Revenue, Occupancy Rate percentage, Total Reservations, and Room Inventory counts.
- **Live Reservation Management:** Instant dropdown to check guests in, check them out, or cancel bookings.
- **Inventory Overview:** Live status indicators for all rooms in the hotel.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, React Router v6, Bootstrap 5, Bootstrap Icons, Axios
- **Backend:** Node.js, Express.js RESTful API, CORS, Dotenv
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS

---

## 📁 Project Structure

```text
hotelpro/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, RoomCard, ProtectedRoute
│   │   ├── context/            # AuthContext (state & tokens)
│   │   ├── pages/              # Home, Rooms, RoomDetails, Login, Register, MyBookings, AdminDashboard
│   │   ├── services/           # Axios API configuration & interceptors
│   │   ├── App.jsx             # Route definitions
│   │   ├── index.css           # Luxury hotel theme styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express.js REST API
│   ├── config/                 # MongoDB database connection (db.js)
│   ├── controllers/            # auth, room, booking, stats controllers
│   ├── middleware/             # auth and error handlers
│   ├── models/                 # User, Room, Booking Mongoose schemas
│   ├── routes/                 # Express API routes
│   ├── seeder.js               # Database seeding script with realistic data
│   ├── server.js               # Main Express application entrypoint
│   └── package.json
├── package.json                # Root package for running full stack concurrently
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI)

### 2. Installation
Open a terminal in the `hotelpro` folder and install dependencies:

```bash
# 1. Install root dependencies
npm install

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables
In `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string).*

### 4. Seed Database with Initial Rooms & Users
Run the seeder from the `server` folder:
```bash
cd server
npm run seed
```

### 5. Running the Application
From the root directory:
```bash
npm run dev
```
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

---

## 🌐 Deploying for Live Demo & GitHub Link

### A. Pushing to GitHub (GitHub Link)
1. Initialize Git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete HotelPro MERN application"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `hotelpro`.
3. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/hotelpro.git
   git branch -M main
   git push -u origin main
   ```
4. Copy the URL to paste into your portal's **GitHub Link** field.

### B. Free Live Deployment (Demo Link)
- **Option 1: Render (Unified Full-Stack Deployment)**
  1. Sign in to [Render.com](https://render.com).
  2. Create a **New Web Service** connected to your GitHub repository.
  3. Build Command: `npm run build`
  4. Start Command: `npm start`
  5. Add Environment Variables: `MONGODB_URI` (from MongoDB Atlas) and `JWT_SECRET`.
  6. Copy your public `https://<app-name>.onrender.com` URL to paste into your portal's **Demo Link** field.

- **Option 2: Vercel (Frontend) + Render (Backend)**
  - Deploy `server/` to Render or Railway.
  - Deploy `client/` to Vercel with environment variable `VITE_API_URL=https://your-server.onrender.com/api`.
