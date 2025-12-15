# Enterprise Scale Features Documentation

This document details the 5 "Enterprise Scale" features added to RetailGenie to support large-scale operations, sustainability goals, and advanced customer engagement.

## 1. Sustainability Tracker
**Location:** `/tools/sustainability`
**Description:** A comprehensive dashboard for monitoring environmental impact, energy usage, and waste diversion across all store locations.
**Key Features:**
- Real-time carbon footprint calculation.
- Energy usage metrics (kWh) with trend analysis.
- Initiative tracking (e.g., "Solar Panel Installation").
- "Offset Carbon" action simulation.

## 2. Loss Prevention AI
**Location:** `/tools/loss-prevention`
**Description:** A security command center that simulates AI-driven video analytics to detect theft, loitering, and safety hazards.
**Key Features:**
- Simulated CCTV grid with "Suspicious Activity" bounding boxes.
- Real-time alert feed with severity levels.
- Camera status monitoring.
- "Lockdown Mode" simulation.

## 3. Gamification Engine
**Location:** `/tools/gamification`
**Description:** A tool for marketing teams to create and manage customer loyalty campaigns, quests, and rewards.
**Key Features:**
- Quest builder (e.g., "Summer Coffee Run").
- Customer leaderboard preview.
- Campaign progress tracking.
- Reward tier configuration.

## 4. Hyper-Local Dispatch
**Location:** `/tools/delivery`
**Description:** An Uber-style dispatch system for managing a local fleet of delivery drivers and assigning orders in real-time.
**Key Features:**
- Live map view of driver locations (simulated).
- Order queue with "Assign Driver" functionality.
- Driver status tracking (Available, En Route, Delivering).
- ETA calculations.

## 5. Smart Fitting Rooms
**Location:** `/tools/fitting-room`
**Description:** A management interface for smart fitting rooms, allowing staff to see occupancy and respond to customer requests from inside the room.
**Key Features:**
- Room occupancy visualization.
- Real-time request alerts (e.g., "Need Size L").
- "Mark Resolved" workflow for staff.
- Customer and item details per room.

---

## Implementation Notes
These features are built using React and Tailwind CSS, with simulated data streams to demonstrate real-time capabilities.
- **Visuals:** `lucide-react` icons are used extensively to create professional, intuitive interfaces.
- **Interactivity:** All dashboards feature interactive elements (tabs, buttons, hover states) to simulate a fully functional application.
