# 🛒 Study Project – Dynamic Configuration in Parallel Systems

This project demonstrates how frontend applications (React & Angular) can dynamically load configuration data at runtime to connect with a backend API, avoiding the need for rebuilds after deployment.

It extends the official lab assignment from the *Parallel and Distributed Systems* course.

---

## 🔧 Technologies Used

- **Frontend 1:** React
- **Frontend 2:** Angular
- **Backend A & B:** Go
- **Databases:** PostgreSQL (2 instances)
- **Containerization:** Docker

---

## 🎯 Project Objective

The goal is to provide **runtime-configurable frontend-backend connectivity**, allowing a deployed frontend (React/Angular) to:

- Load the API endpoint from a `config.json`
- Accept runtime changes through the UI (without rebuild)
- Switch between multiple backend instances dynamically
- Detect and visually indicate the active API connection

This mimics real-world deployment environments with staging, testing, and production backends.

---

## 🧩 System Architecture

- 🔗 **Frontends** are hosted in containers and load `config.json` on startup.
- 🧠 **API URLs** are editable in the UI and stored in `localStorage`.
- 🔄 **All requests** are automatically routed through the current backend.
- 💾 Two separate **PostgreSQL databases** are used for backend isolation.

---

## 🖥️ Frontend Features

- 🧠 **Dynamic API switching**
- 📝 Inline configuration editor
- 🟢 Status indicator for active backend
- 📱 Responsive layout
- 🧼 Clear error messages
- 🛠️ Angular & React side-by-side for educational comparison

---

## 🛠️ Backend Behavior

- Backends are implemented in Go
- Both connect to separate Postgres databases
- The API provides endpoints like `/items`, `/items/:id` for CRUD operations
- The Go backend reads database config via `.env` file

---

## 🐳 Docker: Start the App (recommended in Codespaces)

### Step 1: Build & Run All Containers

```bash
docker compose up --build
```

### Step 2: Open Backend Port (Codespaces only)

```bash
chmod +x open-backend-port.sh
./open-backend-port.sh
```

### Step 3: Stop Containers

```bash
docker compose down
```

---

## 🗃️ Database Access & Setup

Each backend has its own Postgres container with pre-initialized tables.

### Access a Database Container

```bash
docker exec -it shoppingdb-container psql -U hse24 -d shoppingdb
```

```sql
\dt   -- List all tables
\q    -- Exit psql
```

---

## 🔄 Switching Between Backends

In the frontend UI (both React & Angular):

- The user can choose between:
  - **Backend A** → http://localhost:5000
  - **Backend B** → http://localhost:5001
- Switching updates the internal API URL dynamically.
- A visual button state reflects which backend is active.

---

## 🔌 Port Overview

| Component         | Port | Description           |
|------------------|------|-----------------------|
| Backend A        | 5000 | Go REST API (DB A)    |
| Backend B        | 5001 | Go REST API (DB B)    |
| Frontend React   | 6000 | React SPA             |
| Frontend Angular | 6001 | Angular SPA           |
| Database A       | 5432 | PostgreSQL            |
| Database B       | 5433 | PostgreSQL (instance) |

---

## 📁 Project Structure

```
├── backend/
│   └── main.go
├── frontend-react/
│   └── src/
│       └── App.tsx
├── frontend-angular/
│   └── src/app/
│       └── app.component.ts
├── docker-compose.yml
├── .env
├── open-backend-port.sh
└── README.md
```

---

## 💡 Summary

This project demonstrates:

✅ Dynamic configuration without redeployment  
✅ Support for multiple backend instances  
✅ Frontend-only switching logic  
✅ Fully containerized infrastructure  
✅ Practical microservice-like setup in a student project

---

## 👨‍🏫 Author

Project by Philipp Schlosser
Course: Parallel and Distributed Systems
University: Hochschule Esslingen

---