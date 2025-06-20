# Gimmy - Remote Fitness Training Management App

Gimmy is a full-stack web application designed to help personal trainers manage their trainees' fitness programs remotely and allow trainees to follow their plans and track progress.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Creating Test Data (Manual Steps)](#creating-test-data-manual-steps)
- [Using the Application](#using-the-application)
  - [User Roles](#user-roles)
  - [Registration & Login](#registration--login)
  - [Trainer Workflow](#trainer-workflow)
  - [Trainee Workflow](#trainee-workflow)
- [Deployment](#deployment)
  - [Backend (e.g., Render)](#backend-eg-render)
  - [Frontend (e.g., Vercel)](#frontend-eg-vercel)
- [Future Enhancements (Optional)](#future-enhancements-optional)

## Features

**General:**
- User registration (Email/Password & Google Sign-In) and login.
- Separate dashboard views for Trainers and Trainees.
- Publicly viewable "All Exercises" database.
- In-app notifications for key events.
- Email notifications for registration, new plans, and request acceptances.
- Responsive design for desktop and mobile.

**Trainer Specific:**
- Add, edit, and delete exercises (name, description, optional animation URL).
- Search for trainees by name or email.
- Send connection requests to trainees.
- View and manage a list of connected trainees.
- View trainee profiles (name, photo, age, training goal - photo/age/goal are placeholders for now).
- Assign weekly training plans to connected trainees:
    - Select trainee and week.
    - Add exercises to specific days.
    - Specify sets, reps, and notes for each exercise in a session.
    - View and manage trainee's training history.
- Receive notifications when trainees complete sessions or accept requests.

**Trainee Specific:**
- View assigned weekly training plans.
- Mark exercises as completed.
- Access the entire exercise database.
- Manage connection requests from trainers (accept/reject).
- View personal training history.
- Receive notifications for new plans or updated plans.

## Tech Stack

- **Frontend:** React (with Vite), Material UI, Axios, React Router DOM, @react-oauth/google
- **Backend:** Node.js, Express.js, Firebase Admin SDK
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (Email/Password, Google), JWT for session management (backend validates Firebase ID tokens)
- **Email Notifications:** Nodemailer

## Project Structure

gimmy/
├── backend/        # Node.js Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/     # (e.g., emailService.js)
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── frontend/       # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── .env.development.example
│   └── package.json
└── README.md

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- A Google Account (for Firebase and Google Sign-In setup)
- An email account for sending notifications (e.g., Gmail with app password, or a transactional email service like SendGrid/Mailgun)

## Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on "Add project" and create a new Firebase project.
3.  Once created:
    *   **Authentication:** Enable "Email/Password" and "Google" sign-in methods. Provide a project support email for Google Sign-In.
    *   **Firestore Database:** Create a Firestore database. Start in **test mode** for development. Choose a location.
    *   **Service Account (Backend):** Go to Project settings > Service accounts. Generate a new private key (JSON file). Rename it to `serviceAccountKey.json` and place it in `gimmy/backend/config/`. (Ensure your `.gitignore` in `gimmy/backend/` lists `config/serviceAccountKey.json`).
    *   **Web App Config (Frontend Google Sign-In):** In Project settings > General, add a Web App (`</>`). After registration, find your **OAuth 2.0 Client ID** by going to Google Cloud Console > APIs & Services > Credentials (for your Firebase project). This Web client ID is needed for the frontend. Ensure "Authorized JavaScript origins" (e.g., `http://localhost:5173`) and "Authorized redirect URIs" are correctly set up for development and your deployed frontend URL.

## Backend Setup

1.  Navigate to `gimmy/backend`.
2.  Create `.env` from `.env.example`: `cp .env.example .env`.
3.  Edit `.env` with:
    *   `PORT`: e.g., 5001.
    *   `JWT_SECRET`: A strong random string.
    *   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: Your email service details.
4.  Ensure `serviceAccountKey.json` is in `gimmy/backend/config/`.
5.  Install dependencies: `npm install`.
6.  Run: `npm run dev`.

## Frontend Setup

1.  Navigate to `gimmy/frontend`.
2.  Create `.env.development` from `.env.development.example` (or create it).
3.  Edit `.env.development` with:
    *   `VITE_API_URL`: Your backend URL (e.g., `http://localhost:5001/api`).
    *   `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Web Client ID.
4.  Install dependencies: `npm install`.
5.  Run: `npm run dev`. (Usually opens at `http://localhost:5173`).

## Running the Application

1.  Start backend: `cd gimmy/backend && npm run dev`.
2.  Start frontend: `cd gimmy/frontend && npm run dev`.
3.  Open frontend URL in browser.

## Creating Test Data (Manual Steps)

1.  **Register Trainer:** e.g., `trainer@gimmy.com`, role "Trainer".
2.  **Register Trainee:** e.g., `trainee@gimmy.com`, role "Trainee".
3.  **Add Exercises (as Trainer):**
    *   Log in as Trainer. Go to Dashboard > "My Exercises" tab.
    *   **Squat:** (Description: A compound, full-body exercise...)
    *   **Bench Press:** (Description: An upper-body strength training exercise...)
    *   **Pull-Up:** (Description: An upper-body strength exercise...)

## Using the Application

(Briefly describe key workflows for Trainer and Trainee as outlined in previous detailed plan - e.g., Trainer adds exercises, connects with Trainees, assigns plans. Trainee views plans, marks completion, manages requests.)

## Deployment

### Backend (e.g., Render)
1.  Push to Git. Connect repo to Render Web Service.
2.  Build: `npm install`. Start: `npm start`.
3.  Set all backend `.env` variables in Render's environment settings. For `serviceAccountKey.json`, convert its content to a single-line JSON string and store in an env var like `FIREBASE_SERVICE_ACCOUNT_JSON`. Modify `backend/config/firebaseConfig.js` to parse this env var if present.
4.  Note public backend URL.

### Frontend (e.g., Vercel)
1.  Push to Git. Connect `gimmy/frontend` directory to Vercel.
2.  Framework: Vite. Build: `npm run build`. Output: `dist`.
3.  Set env vars: `VITE_API_URL` (to deployed backend URL), `VITE_GOOGLE_CLIENT_ID`.
4.  Deploy. Update Google Cloud Console OAuth Client ID's authorized origins/redirects with Vercel URL.

## Future Enhancements (Optional)
- Real-time chat.
- Detailed analytics.
- Nutrition logging.
