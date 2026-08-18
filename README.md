# 🚀 BridgeNow - Creator & Brand Collaboration Platform

**BridgeNow** is a modern, high-performance web platform designed to seamlessly connect content creators, freelancers, and brand clients. It features real-time gig management, wallet transactions, and secure SQL-backed authentication.

---

## 🌟 Key Features

- **🔐 Secure SQL Authentication**: JWT authentication backed by SQLite (`better-sqlite3`) with `bcrypt` password hashing.
- **💼 Gig Management**: Create, track progress, filter, and manage brand collaboration gigs.
- **💳 Wallet & Financial Transactions**: Real-time wallet balance tracking with support for funds deposits, payouts, and transaction history.
- **✨ Modern & Responsive UI**: Built with React 19, Tailwind CSS, glassmorphism aesthetics, and smooth micro-interactions.
- **⚡ Fast Development Setup**: Concurrently runs Express API server and Vite frontend server.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Framer Motion, GSAP |
| **Backend** | Node.js, Express 5 |
| **Database** | SQLite (`better-sqlite3` with WAL mode & foreign keys) |
| **Auth & Security**| JSON Web Tokens (JWT), bcryptjs, CORS |

---

## 📋 Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

Check versions in your terminal:
```bash
node -v
npm -v
```

---

## 🚀 Step-by-Step Installation & Running Guide

Follow these steps to get the project running perfectly on your local machine.

### Step 1: Clone / Open Project Directory
Navigate to the project root directory:
```bash
cd bridge-now
```

### Step 2: Install Dependencies
Install all required frontend and backend packages:
```bash
npm install
```

### Step 3: (Optional) Environment Configuration
The backend automatically provides fallback defaults for local development. However, you can optionally create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_custom_secure_jwt_secret_key_2026
```

### Step 4: Start the Application (Recommended)

To run **both** the backend Express server (`http://localhost:5000`) and the Vite frontend dev server (`http://localhost:5173`), run:

```bash
npm run dev:all
```

> **⚠️ IMPORTANT:** Do **not** run `npm run dev` alone, as that only starts the frontend. `npm run dev:all` launches both the backend API server and Vite frontend together so that API requests and authentication work properly.

---

## 🎯 Quick Access & Demo Credentials

Once the application is running, open your browser and go to:
👉 **[http://localhost:5173](http://localhost:5173)**

### Pre-configured Demo User Account:
You can log in using the built-in demo credentials or click **"Auto-fill Demo User"** in the Sign In modal:

- **Email:** `demo@bridgenow.com`
- **Password:** `password123`

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev:all` | **(Recommended)** Starts both Express backend server (port 5000) & Vite frontend (port 5173) simultaneously using `concurrently`. |
| `npm run dev` | Starts Vite frontend dev server only. |
| `npm run server` | Starts Express backend server only. |
| `npm run build` | Builds the production bundle for deployment. |
| `npm run preview` | Previews the production build locally. |

---

## 🔍 Project Architecture & Directory Structure

```text
bridge-now/
├── server/                    # Express Backend & SQLite Database
│   ├── config/                # Environment configuration
│   ├── controllers/           # Auth, Gigs, and Transactions controllers
│   ├── db/                    # Database connection & schema initialization
│   │   ├── database.db        # SQLite database file (auto-created)
│   │   └── database.js        # Schema & migrations setup
│   ├── middleware/            # Auth JWT & error handler middlewares
│   ├── routes/                # Express router endpoints (/api/auth, /api/gigs, etc.)
│   └── index.js               # Express server entry point
├── src/                       # React Frontend (Vite)
│   ├── components/            # UI components (AuthModal, Dashboard, Navbar, etc.)
│   ├── services/              # API communication layer (auth.js, dashboardService.js)
│   ├── App.jsx                # Main App component
│   └── main.jsx               # Entry point
├── vite.config.js             # Vite configuration & /api proxy to localhost:5000
└── package.json               # Dependencies & npm scripts
```

---

## ❓ Troubleshooting & FAQs

### 1. `Failed to execute 'json' on 'Response': Unexpected end of JSON input`
- **Cause**: The Express backend server on port 5000 is not running.
- **Fix**: Make sure to run `npm run dev:all` (or start `npm run server` in a separate terminal) so port 5000 is active.

### 2. `EADDRINUSE: address already in use :::5000`
- **Cause**: Another process is using port 5000.
- **Fix**: Kill the process using port 5000 or specify a different port in `.env` (e.g. `PORT=5001`).

```bash
# On Linux/macOS:
npx kill-port 5000
```
