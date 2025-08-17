# Zipline: Frontend Application

<p align="center">
  <img alt="Tech Stack" src="https://img.shields.io/badge/tech-Next.js%20%7C%20React%20%7C%20TypeScript-blue">
</p>

This is the frontend for the Zipline CI/CD platform, a modern web application built with Next.js and React. It provides a dynamic and real-time interface for users to manage their repositories, view pipeline executions, and interact with their build workflows.

---

## ✨ Core Features

* **Live DAG Visualization:** Renders pipeline structures as an interactive graph using React Flow, with real-time status updates for each step.
* **Real-time Log Streaming:** Displays log output from pipeline runners as it happens, using a WebSocket connection for immediate feedback.
* **GitHub Authentication:** Securely logs in users via a GitHub OAuth flow.
* **Repository Management:** Allows users to view and connect their GitHub repositories to the Zipline platform.
* **Run History:** Provides a detailed view of all past and present pipeline runs for each repository.
* **User Controls:** Includes UI elements for canceling running pipelines and re-running completed ones.
* **Artifacts & Secrets:** Provides interfaces for downloading build artifacts and managing repository secrets.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI Library:** React
* **Graph Visualization:** React Flow
* **Real-time Communication:** Socket.io
* **Styling:** CSS Modules / Tailwind CSS (as applicable)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* The Zipline backend server must be running.

### Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file by copying the `.env.example` file. Fill in the necessary values, such as the backend API URL.
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

The frontend application should now be running at `http://localhost:3000`.

