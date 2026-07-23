# RetailGenie System Architecture & Technical Design

## System Overview

RetailGenie is an enterprise-grade, modular Retail Operating System (Retail OS) designed with a decoupled micro-architecture combining a Python/Flask REST API backend and a Next.js 14 (App Router) frontend interface.

```
                  ┌────────────────────────────────────────┐
                  │          Next.js 14 Frontend           │
                  │   (TypeScript, Tailwind, Lucide, API)  │
                  └──────────────────┬─────────────────────┘
                                     │ HTTP / REST (JWT Auth)
                                     ▼
                  ┌────────────────────────────────────────┐
                  │       Flask Application Factory        │
                  │             (app.py / __init__.py)     │
                  └──────────────────┬─────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │ Auth & Core BPs │       │  Safety/Sensory │       │  AI Intelligence│
  │  (Auth, Products│       │(ColdChain, Waste│       │  (VectorStore,  │
  │   Orders, Admin)│       │  Biometrics, Emg)│      │  PredictDemand) │
  └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                  ┌────────────────────────────────────────┐
                  │          Firebase Firestore Data       │
                  │       (Persistent In-Memory / Cloud)   │
                  └────────────────────────────────────────┘
```

---

## Architectural Principles

1. **Modular Blueprint Decomposition**:
   - The Flask backend utilizes Blueprint registration in `app/__init__.py`. Routes, logic, and controllers are decoupled into domain-specific modules (Products, Inventory, AI Assistant, Pricing, Safety, Suppliers, Settings, Notifications).

2. **Persistent Fallback Persistence**:
   - `FirebaseUtils` implements a persistent in-memory database fallback (`_mock_data` class attribute) for seamless local execution without requiring GCP/Firebase production credentials.

3. **JWT Authentication & Middleware**:
   - Centralized `AuthMiddleware` (`backend/app/middleware/auth_middleware.py`) decorates protected endpoints with `@require_auth`, enforcing token verification while supporting dev test bypass modes.

4. **Full-Stack Resilience & Graceful Degradation**:
   - Frontend components use 5-second background polling (`getColdChainMetrics`, `getWasteMetrics`, `getStoreSentiment`) with instant local fallback logic, guaranteeing 100% uptime for portfolio demonstrations even when disconnected from the backend.

---

## Directory & Package Map

```
RetailGenie/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Business logic controllers (Pricing, Inventory, Auth, Products)
│   │   ├── middleware/       # AuthMiddleware & JWT token validation
│   │   ├── routes/           # 14 Blueprint route handlers (54+ REST API endpoints)
│   │   └── utils/            # Firebase, VectorStore, Email utilities
│   ├── config/               # Flask Config & environment parsing
│   ├── tests/                # Pytest test suites (66 passing tests)
│   └── app.py                # Main backend entry point
├── frontend/
│   ├── app/                  # Next.js 14 App Router pages (Dashboard, Tools, Analytics, Products, Orders)
│   ├── components/           # Reusable UI components (NavBar, ThemeProvider, Modals)
│   ├── context/              # AuthContext & state providers
│   └── lib/                  # Central API client layer (`api.ts` with Axios interceptor)
└── docs/                     # Technical specifications & API guides
```
