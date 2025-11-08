# Credit Card Management System - Full-Stack Technical Challenge

A production-ready prototype of a Credit Card Management System providing secure user authentication, encrypted storage of sensitive financial data, a data-driven dashboard with interactive visualizations, and AI-powered financial insights (Google Gemini Pro).
🚀 Live Demo
Try it out here:
👉 https://credit-card-management-system-lyart.vercel.app/login

You can log in using the demo account below or register a new user to explore the system:

# Demo Credentials:

- Email: test2@gmail.com
- Password: 12345678

## Features

- 🛡️ Secure User Management

  - Full authentication: user registration and login
  - JWT-powered sessions for stateless authentication
  - Passwords hashed with bcryptjs
  - Protected routes: users can only access their own data

- 💳 Encrypted Card Data Management

  - AES-256-CBC encryption of credit card numbers (server-side) with key from environment variable
  - Full CRUD for monthly bills and payments
  - Dynamic financial metrics per card: Current Balance, Used Limit, Unused Limit
  - Categorized spending for analysis

- 📊 Data-Driven Dashboard with AI Insights
  - Interactive visualizations (e.g., Recharts)
  - Spending composition analysis (pie chart, time filters)
  - Advanced AI insights from Google Gemini Pro: - Financial risk score - Top spending category - Spending & payment habit analysis - Personalized advice and predicted date to reach credit limit
    <img width="1358" height="629" alt="image" src="https://github.com/user-attachments/assets/e55e8c43-b2e9-4c51-b71e-f5aa1d936e96" />
    <img width="1359" height="630" alt="image" src="https://github.com/user-attachments/assets/97646a71-c72f-4c31-8011-10a00f66168f" />
    <img width="1903" height="943" alt="image" src="https://github.com/user-attachments/assets/4fc8b756-f108-4c5a-b6ed-b90aef8a9835" />
    <img width="1893" height="749" alt="image" src="https://github.com/user-attachments/assets/3fe337b6-0e78-4edd-92b9-429bcf95fd28" />

## Tech Stack

- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MySQL
- Key libraries: Axios, Recharts, bcryptjs, jsonwebtoken, dotenv, cors
- AI: Google Gemini Pro via @google/genai SDK

## Getting Started

Prerequisites:

- Node.js v18+
- npm or yarn
- Git
- Running MySQL server (XAMPP/WAMP or direct install)

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit backend/.env with your credentials
```

3. Database

- Create a MySQL database matching DB_NAME in backend/.env (e.g., `card_manager_db`).
- The server will create required tables (`users`, `credit_cards`, `categories`, `monthly_bills`) and seed categories on first run.

4. Frontend

```bash
cd frontend
npm install
```

## Environment Variables (backend/.env)

Example (.env.example):

```env
# Database
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=card_manager_db

# Security
JWT_SECRET=your_super_secret_jwt_string_that_is_long
# ENCRYPTION_KEY must be exactly 32 characters for AES-256
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8a1b2c3d4e5f6g7h8

# Google Gemini API Key
GEMINI_API_KEY=your_google_ai_studio_api_key
```
