# 🚀 RetailGenie — Modern Enterprise Retail Operating System (Retail OS)

[![Build & Test Status](https://img.shields.io/badge/Pytest-66%2F66%20Passed-success?style=for-the-badge&logo=pytest)](https://github.com/deepakbajaj12/RetailGenie)
[![Frontend](https://img.shields.io/badge/Next.js-14%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Python-Flask%20API-blue?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

**RetailGenie** is a full-stack, enterprise-grade **Retail Operating System (Retail OS)** built to power modern smart retail environments. It seamlessly connects AI-driven demand forecasting, dynamic pricing engines, IoT cold-chain telemetry, biometric checkout, and supplier management into a unified responsive dashboard.

---

## 🌟 Key Portfolio Highlights (B.Tech Showcase)

This project demonstrates production-ready software engineering standards designed to impress technical recruiters:

* **🏗️ Full-Stack Modular Architecture**: Decoupled Python/Flask REST API backend organized into 14 Blueprint modules, paired with a Next.js 14 (App Router) TypeScript frontend.
* **🔐 Robust Security**: JWT-based authentication middleware (`AuthMiddleware`) with standard `Authorization: Bearer <token>` headers and password hashing via `bcrypt`.
* **🧪 100% Automated Test Coverage**: 66 comprehensive `pytest` backend tests covering authentication, order processing, product CRUD, analytics aggregation, settings, and notifications.
* **🤖 AI & Machine Learning Integration**: OpenAI-powered product description generator, vector-based semantic search, sentiment tracking, and dynamic pricing algorithms.
* **🛡️ Full System Resilience**: 5-second background polling for IoT sensory tools with instant graceful fallback data structures ensuring 100% demo availability.
* **🐳 Docker Orchestration**: One-command launch via `docker-compose.yml` for multi-container deployment.

---

## 📊 System Architecture

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

## 🛠️ Feature Modules Overview

| Category | Modules & Features | Key API Routes |
|----------|--------------------|----------------|
| **Authentication & Users** | User Login, Registration, JWT Sessions, Notification Feeds, User Settings | `/api/auth/*`, `/api/notifications`, `/api/settings` |
| **Catalog & Orders** | Product Management, Inventory Tracking, Low Stock Alerts, Order Lifecycle | `/api/products/*`, `/api/orders/*`, `/api/inventory/*` |
| **Pricing & Logistics** | Dynamic Price Optimization, Competitor Analysis, Supplier Management | `/api/pricing/*`, `/api/suppliers/*` |
| **Safety & IoT Sensory** | Cold Chain Monitoring, Smart Waste Sorting, Biometric Pay, Emergency Dispatch | `/api/safety/*` |
| **AI Intelligence** | Feedback Summarizer, Semantic Search, Product Description Generator | `/ai/*`, `/api/predict-demand/*` |

---

## 🚀 Quick Start Guide

### Option 1: Docker (Recommended)

Run the entire full-stack application (Backend + Frontend) with one command:

```bash
docker-compose up --build
```
* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:5000`

---

### Option 2: Local Development

#### Prerequisites
* **Node.js**: v18.x or higher
* **Python**: v3.9 or higher

#### 1. Backend Setup (Flask API)
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000` with 54+ active REST endpoints.*

#### 2. Frontend Setup (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🧪 Running Automated Tests

Run the full pytest suite to verify backend contracts and database persistence:

```bash
cd backend
pytest -v
```

**Test Output:**
```text
======================= 66 passed in 1.42s =======================
```

---

## 📑 Documentation

* 📚 [System Architecture Guide](docs/ARCHITECTURE.md)
* 📖 [Complete REST API Specification](docs/API_DOCUMENTATION.md)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
