# RetailGenie REST API Reference Guide

This document specifies all 54+ REST API endpoints exposed by the RetailGenie Flask backend server running on `http://localhost:5000`.

---

## 🔐 Authentication & Security

All protected endpoints expect an `Authorization: Bearer <token>` HTTP header.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile | Yes |

---

## 🛍️ Product Catalog & Inventory

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/products` | List all catalog products | No |
| `POST` | `/api/products` | Create a new product entry | Yes |
| `GET`  | `/api/products/<id>` | Fetch product details by ID | No |
| `PUT`  | `/api/products/<id>` | Update an existing product | Yes |
| `DELETE`|`/api/products/<id>`| Remove product from catalog | Yes |
| `GET`  | `/api/inventory/stock-alerts` | Get low stock alert list | No |
| `POST` | `/api/inventory/optimization` | Generate AI inventory optimization tips | No |
| `GET`  | `/api/inventory/forecast` | Retrieve demand forecast metrics | No |

---

## 📦 Order Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/orders` | List customer orders | No |
| `POST` | `/api/orders` | Create a new order | Yes |
| `PUT`  | `/api/orders/<id>` | Update order status | Yes |
| `DELETE`|`/api/orders/<id>`| Cancel and remove order | Yes |

---

## 🏷️ Pricing & Dynamic Optimization Engine

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/pricing/optimize` | Calculate optimal pricing for products | No |
| `GET`  | `/api/pricing/competitor-analysis` | Compare product prices against market | No |
| `POST` | `/api/pricing/demand-based` | Calculate dynamic demand-based pricing | No |

---

## 🚚 Supplier Relationship Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/suppliers` | List all suppliers | No |
| `POST` | `/api/suppliers` | Register a new supplier | Yes |
| `PUT`  | `/api/suppliers/<id>` | Update supplier information | Yes |
| `DELETE`|`/api/suppliers/<id>`| Delete supplier | Yes |

---

## 🚨 Safety, Sensory & IoT Module

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/safety/cold-chain` | Fetch IoT temperature & humidity metrics | No |
| `GET`  | `/api/safety/waste` | Fetch smart bin waste levels | No |
| `GET`  | `/api/safety/sentiment` | Fetch store atmosphere mood score | No |
| `POST` | `/api/safety/biometric-verify` | Perform face/palm verification simulation | No |
| `POST` | `/api/safety/emergency` | Log emergency command center alert | No |

---

## ⚙️ System Settings & Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/settings` | Fetch user settings | No |
| `PUT`  | `/api/settings` | Save updated system settings | No |
| `GET`  | `/api/notifications` | Fetch user notifications | No |
| `PUT`  | `/api/notifications/<id>/read` | Mark notification as read | No |
| `DELETE`|`/api/notifications/<id>`| Remove notification | No |
