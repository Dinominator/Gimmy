# Gimmy - Remote Fitness Training Management App

Gimmy is a full-stack web application designed to help personal trainers manage their trainees' fitness programs remotely and allow trainees to follow their plans and track progress.

**For detailed setup, configuration, and troubleshooting instructions, please refer to [MANUAL_SETUP.md](./MANUAL_SETUP.md).**

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Core Setup Steps (Overview)](#core-setup-steps-overview)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [Deployment Overview](#deployment-overview)
- [Detailed Instructions](#detailed-instructions)

## Features

**General:**
- User registration (Email/Password & Google Sign-In) - *Registration via UI is for 'Trainee' role only.*
- Separate dashboard views for Trainers and Trainees.
- "All Exercises" database (visible to authenticated users).
- In-app notifications (UI in Navbar, backend logic for creation).
- Email notifications for registration, new/updated plans, and connection acceptances.
- Responsive design for desktop and mobile (full-width layout).
- Modernized UI theme.

**Trainer Specific:**
- Add, edit, and delete exercises.
- Search for trainees by name or email.
- Send connection requests to trainees.
- View and manage connected trainees (remove connection).
- View selected trainee's training plan history.
- *Training Plan Assignment UI:* Basic structure present (select trainee, week navigation, view daily exercises). Full interactive assignment (drag & drop, detailed set/rep input) is a future enhancement.
- Receive notifications for trainee actions.

**Trainee Specific:**
- View assigned weekly training plans (basic UI with exercise listing and completion checkboxes).
- Mark exercises as completed (UI present, backend integration for updates).
- Access the "All Exercises" database.
- Manage connection requests from trainers (accept/reject).
- View personal training plan history.
- Receive notifications for plan updates.

## Tech Stack

- **Frontend:** React (with Vite), Material UI, Axios, React Router DOM, @react-oauth/google
- **Backend:** Node.js, Express.js, Firebase Admin SDK
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (Email/Password, Google), Custom JWTs for session management.
- **Email Notifications:** Nodemailer

## Project Structure

```
gimmy/
├── backend/        # Node.js Express backend
├── frontend/       # React frontend
├── MANUAL_SETUP.md # Detailed setup, configuration, and troubleshooting
└── README.md       # This file (Project overview)
```

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (or yarn)
- A Google Account (for Firebase and Google Sign-In)
- An email account for sending notifications.

## Core Setup Steps (Overview)

1.  **Firebase Project:** Create/configure Firebase (Authentication, Firestore, Service Account Key).
2.  **Backend (`gimmy/backend/`):** Place `serviceAccountKey.json`, create and populate `.env` (for `PORT`, `FRONTEND_URL`, `JWT_SECRET`, Email credentials). Run `npm install`.
3.  **Frontend (`gimmy/frontend/`):** Create and populate `.env.development` (for `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`). Configure Google Cloud Console OAuth Client. Run `npm install`.

**--> For detailed, step-by-step instructions for all setup and configuration, see [MANUAL_SETUP.md](./MANUAL_SETUP.md).**

## Running the Application

1.  **Start Backend:** `cd gimmy/backend && npm run dev`
2.  **Start Frontend:** `cd gimmy/frontend && npm run dev`
3.  Open the frontend URL (e.g., `http://localhost:5173`) in your browser.

**--> For troubleshooting common startup issues, see [MANUAL_SETUP.md](./MANUAL_SETUP.md#7-rješavanje-problema-troubleshooting).**

## Using the Application

### Key Workflows:
- **Registration:** New users sign up as 'Trainees'.
- **Login:** Trainees use main login. Trainers use "Login as Trainer" button (trainer accounts are created manually in Firebase as per `MANUAL_SETUP.md`).
- **Trainers:** Manage exercises, find/connect with trainees, view trainee history. Basic UI for viewing daily assigned exercises for a trainee is present.
- **Trainees:** View their daily/weekly plan, mark exercises complete, manage connection requests, view history.

**--> For detailed steps on creating test data and more usage examples, see [MANUAL_SETUP.md](./MANUAL_SETUP.md#6-kreiranje-testnih-podataka).**

## Deployment Overview

- **Backend (e.g., Render):** Requires Git setup, build/start commands, and careful environment variable configuration (including `FIREBASE_SERVICE_ACCOUNT_JSON`).
- **Frontend (e.g., Vercel):** Requires Git setup, framework detection (Vite), and environment variables for API URL and Google Client ID. Google Cloud Console OAuth settings must be updated with deployed URLs.

*(Detailed deployment steps specific to platforms like Render or Vercel can be further elaborated in `MANUAL_SETUP.md` or a separate `DEPLOYMENT.md` if needed.)*

## Detailed Instructions
All detailed setup, configuration, test data creation, and troubleshooting steps are located in:
**[MANUAL_SETUP.md](./MANUAL_SETUP.md)**
