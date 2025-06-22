# Gimmy - Upute za Ručno Postavljanje i Konfiguraciju

Ova datoteka sadrži detaljne korak-po-korak upute koje trebate slijediti kako biste uspješno postavili, konfigurirali, pokrenuli i testirali Gimmy aplikaciju na vašem lokalnom računalu.

## Sadržaj

1.  [Priprema Radnog Okruženja](#1-priprema-radnog-okruženja)
    *   [Brisanje Stare Lokalne Kopije (Opcionalno)](#brisanje-stare-lokalne-kopije-opcionalno)
    *   [Kloniranje Najnovijeg Koda s GitHuba](#kloniranje-najnovijeg-koda-s-githuba)
    *   [Prerequisites (Podsjetnik)](#prerequisites-podsjetnik)
2.  [Postavljanje Firebase Projekta (Podsjetnik)](#2-postavljanje-firebase-projekta-podsjetnik)
3.  [Backend Konfiguracija (`gimmy/backend/`)](#3-backend-konfiguracija-gimmybackend)
    *   [Postavljanje `serviceAccountKey.json`](#postavljanje-serviceaccountkeyjson)
    *   [Kreiranje i Popunjavanje `.env` Datoteke](#kreiranje-i-popunjavanje-env-datoteke)
    *   [Instalacija Backend Ovisnosti](#instalacija-backend-ovisnosti)
4.  [Frontend Konfiguracija (`gimmy/frontend/`)](#4-frontend-konfiguracija-gimmyfrontend)
    *   [Kreiranje i Popunjavanje `.env.development` Datoteke](#kreiranje-i-popunjavanje-envdevelopment-datoteke)
    *   [Google Cloud Console - Postavke OAuth 2.0 Klijenta (KRITIČNO za Google Prijavu)](#google-cloud-console---postavke-oauth-20-klijenta-kritično-za-google-prijavu)
    *   [Instalacija Frontend Ovisnosti](#instalacija-frontend-ovisnosti)
5.  [Pokretanje Aplikacije](#5-pokretanje-aplikacije)
    *   [Pokretanje Backend Servera](#pokretanje-backend-servera)
    *   [Pokretanje Frontend Aplikacije](#pokretanje-frontend-aplikacije)
    *   [Provjera Aplikacije u Pregledniku](#provjera-aplikacije-u-pregledniku)
6.  [Kreiranje Testnih Podataka](#6-kreiranje-testnih-podataka)
    *   [Kreiranje Testnog Trener Računa (Ručno u Firebase Konzoli)](#kreiranje-testnog-trener-računa-ručno-u-firebase-konzoli)
    *   [Kreiranje Testnog Trainee Računa (Kroz Aplikaciju)](#kreiranje-testnog-trainee-računa-kroz-aplikaciju)
    *   [Dodavanje Testnih Vježbi (Kao Trener)](#dodavanje-testnih-vježbi-kao-trener)
7.  [Rješavanje Problema (Troubleshooting)](#7-rješavanje-problema-troubleshooting)
    *   [Problem s `code` Naredbom na Macu (zsh: command not found: code)](#problem-s-code-naredbom-na-macu-zsh-command-not-found-code)
    *   [Backend Greška: `EADDRINUSE`](#backend-greška-eaddrinuse)
    *   [Frontend Greška: `OAuth client was not found`](#frontend-greška-oauth-client-was-not-found)
    *   [Frontend Greška: "Network Error" pri Registraciji](#frontend-greška-network-error-pri-registraciji)

---

## 1. Priprema Radnog Okruženja

### Brisanje Stare Lokalne Kopije (Opcionalno)
Ako imate staru lokalnu kopiju projekta i želite početi "od nule":
*   Otvorite terminal.
*   Navigirajte do direktorija gdje se nalazi vaš `gimmy` projekt (npr. `cd ~/Projects`).
*   Izvršite: `rm -rf gimmy` (Oprez: trajno briše!)

### Kloniranje Najnovijeg Koda s GitHuba
Ako nemate projekt ili ste obrisali stari:
1.  Otvorite terminal.
2.  Navigirajte gdje želite smjestiti projekt.
3.  Klonirajte repozitorij:
    ```bash
    git clone TVOJ_GITHUB_REPO_LINK_OVDJE gimmy
    cd gimmy
    ```
    (Zamijenite `TVOJ_GITHUB_REPO_LINK_OVDJE`.)

Ako samo ažurirate postojeći projekt:
1.  U terminalu, `cd path/to/gimmy`
2.  Povucite promjene:
    ```bash
    git pull origin IME_GRANE # Npr. main ili develop
    ```

### Prerequisites (Podsjetnik)
- Node.js (v16+)
- npm ili yarn
- Google Račun

---

## 2. Postavljanje Firebase Projekta (Podsjetnik)
Pratite upute iz glavnog `README.md` (sekcija "Firebase Setup") za kreiranje Firebase projekta, omogućavanje Authentication (Email/Password, Google) i Firestore Database (u test modu).

---

## 3. Backend Konfiguracija (`gimmy/backend/`)

### Postavljanje `serviceAccountKey.json`
1.  Iz Firebase Konzole (Project settings > Service accounts), generirajte novi privatni ključ.
2.  Preimenujte preuzetu JSON datoteku u `serviceAccountKey.json`.
3.  Smjestite je u `gimmy/backend/config/serviceAccountKey.json`.
    *   **Ne commitajte ovu datoteku na GitHub!**

### Kreiranje i Popunjavanje `.env` Datoteke
1.  U terminalu, `cd gimmy/backend/`.
2.  Kreirajte `.env` datoteku: `cp .env.example .env` (Ako `.env.example` ne postoji, koristite predložak ispod).
3.  Otvorite `gimmy/backend/.env` i unesite **svoje stvarne vrijednosti**:

    ```env
    # Backend Port
    PORT=5001

    # URL vašeg frontend razvojnog servera (za CORS)
    FRONTEND_URL=http://localhost:5173

    # JWT Secret Key - GENERIRAJTE JAK, SLUČAJAN STRING!
    JWT_SECRET="OVDJE_TVOJ_SUPER_TAJNI_JWT_KLJUC_MIN_32_ZNAKA"

    # Email Configuration (za Nodemailer)
    # Primjer za Gmail (koristite "App Password" ako imate 2FA):
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=tvoj.email@gmail.com
    EMAIL_PASS=tvoja_gmail_app_password
    EMAIL_FROM='"Gimmy Fitness App" <tvoj.email@gmail.com>'

    # Ako ne koristite Gmail, unesite SMTP podatke vašeg providera:
    # EMAIL_HOST=
    # EMAIL_PORT=
    # EMAIL_USER=
    # EMAIL_PASS=
    # EMAIL_FROM=
    ```
    *   **`JWT_SECRET`**: Izuzetno važno. Mora biti jak i jedinstven.
    *   **`EMAIL_PASS`**: Za Gmail s 2FA, ovo **mora** biti "App Password".
    *   **Ova `.env` datoteka se NIKADA ne smije commitati na GitHub.**

### Instalacija Backend Ovisnosti
1.  U terminalu, unutar `gimmy/backend/`:
    ```bash
    npm install
    ```

---

## 4. Frontend Konfiguracija (`gimmy/frontend/`)

### Kreiranje i Popunjavanje `.env.development` Datoteke
1.  U terminalu, `cd gimmy/frontend/`.
2.  Kreirajte `.env.development`: `cp .env.development.example .env.development` (Ako `.env.development.example` ne postoji, koristite predložak ispod).
3.  Otvorite `gimmy/frontend/.env.development` i unesite **svoje stvarne vrijednosti**:

    ```env
    # Frontend API URL - Puna putanja do vašeg backend API-ja
    VITE_API_URL=http://localhost:5001/api

    # Google Client ID for Google Sign-In
    # Ovo MORATE zamijeniti s vašim stvarnim OAuth 2.0 Client ID-em iz Google Cloud Console
    VITE_GOOGLE_CLIENT_ID="TVOJ_GOOGLE_OAUTH_WEB_CLIENT_ID.apps.googleusercontent.com"
    ```

### Google Cloud Console - Postavke OAuth 2.0 Klijenta (KRITIČNO za Google Prijavu)
Ako Google Prijava ne radi (npr. `invalid_client` greška):
1.  Idite na [Google Cloud Console](https://console.cloud.google.com/).
2.  Odaberite projekt povezan s Firebaseom.
3.  Idite na **APIs & Services > Credentials**.
4.  Pronađite **OAuth 2.0 Client ID** (tip "Web application") koji ste unijeli u `VITE_GOOGLE_CLIENT_ID`. Kliknite na ime klijenta.
5.  **Authorized JavaScript origins**: **MORA** sadržavati `http://localhost:5173` (ili port vašeg Vite servera).
6.  **Authorized redirect URIs**: **MORA** sadržavati barem `http://localhost:5173`. Razmislite o dodavanju i `http://localhost:5173/` i `http://localhost:5173/auth/google/callback`.
7.  Spremite promjene. Može proći nekoliko minuta da se aktiviraju.
8.  Također provjerite je li **Identity Toolkit API** (ili Google People API) omogućen u "APIs & Services > Library".

### Instalacija Frontend Ovisnosti
1.  U terminalu, unutar `gimmy/frontend/`:
    ```bash
    npm install
    ```

---

## 5. Pokretanje Aplikacije

### Pokretanje Backend Servera
1.  Terminal 1: `cd gimmy/backend && npm run dev`
2.  Pratite konzolu za poruku `Server is running on port: 5001` i status email transportera.

### Pokretanje Frontend Aplikacije
1.  Terminal 2: `cd gimmy/frontend && npm run dev`
2.  Vite će ispisati URL (npr. `http://localhost:5173/`).

### Provjera Aplikacije u Pregledniku
1.  Otvorite frontend URL u pregledniku.
2.  Otvorite Developer Tools (Console i Network tab) za praćenje grešaka.

---

## 6. Kreiranje Testnih Podataka

### Kreiranje Testnog Trener Računa (Ručno u Firebase Konzoli)
**Email:** `trainer@gimmy.com`, **Lozinka:** `trainer123` (ili po izboru), **Ime:** `Test Trainer`, **Uloga:** `trainer`
1.  **Firebase Console > Authentication > Add user**: Unesite email i lozinku. Kopirajte **User UID**.
2.  **Firebase Console > Firestore Database > `users` collection > Add document**:
    *   Document ID: (Zalijepite User UID).
    *   Polja: `uid` (string, User UID), `email` (string), `name` (string), `role` (string, "trainer"), `createdAt` (timestamp). Opcionalno: `photoURL`, `age`, `trainingGoal`. Spremite.

### Kreiranje Testnog Trainee Računa (Kroz Aplikaciju)
1.  Nakon što aplikacija radi i **ako je "Network Error" riješen**, idite na "Sign Up" stranicu.
2.  Registrirajte korisnika (npr. Ime: `Test Trainee`, Email: `trainee@gimmy.com`, Lozinka: `trainee123`). Automatski će biti "trainee".

### Dodavanje Testnih Vježbi (Kao Trener)
1.  Prijavite se kao `trainer@gimmy.com`.
2.  Idite na Trainer Dashboard > "My Exercises".
3.  Dodajte vježbe: Squat, Bench Press, Pull-Up (s opisima).

---

## 7. Rješavanje Problema (Troubleshooting)

### Problem s `code` Naredbom na Macu (`zsh: command not found: code`)
Ako `code .` ne radi u VS Code na macOS-u:
1.  VS Code > Command Palette (`Shift + Command + P`) > upišite `Shell Command: Install 'code' command in PATH`.
2.  Alternativno, ručno (prilagodite putanju do VS Code ako treba):
    ```bash
    # Prvo provjerite postoji li link i kamo pokazuje: ls -l /usr/local/bin/code
    # Ako treba, uklonite stari (oprez!): sudo rm /usr/local/bin/code
    sudo ln -s "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" /usr/local/bin/code
    ```
3.  **Potpuno zatvorite i ponovno otvorite Terminal.**

### Backend Greška: `EADDRINUSE` (npr. `:::5000` ili `:::5001`)
*   Port je zauzet. Provjerite da `gimmy/backend/.env` ima ispravan `PORT` (npr. `5001`).
*   Pronađite i zaustavite proces koji koristi taj port (macOS/Linux: `sudo lsof -i :PORT_BROJ` pa `kill -9 PID`; Windows: `netstat -ano | findstr :PORT_BROJ` pa `taskkill /PID PID_BROJ /F`).
*   Ili promijenite `PORT` u `.env` na neki drugi slobodan port.

### Frontend Greška: `OAuth client was not found` (Google Prijava)
*   **Apsolutno provjerite `VITE_GOOGLE_CLIENT_ID`** u `gimmy/frontend/.env.development`.
*   **Apsolutno provjerite "Authorized JavaScript origins" i "Authorized redirect URIs"** u Google Cloud Console za vaš OAuth 2.0 klijent. Moraju sadržavati `http://localhost:TVOJ_FRONTEND_PORT` (npr. `http://localhost:5173`).

### Frontend Greška: "Network Error" pri Registraciji
*   Provjerite radi li backend server na očekivanom portu.
*   Provjerite je li `VITE_API_URL` u `gimmy/frontend/.env.development` ispravan (npr. `http://localhost:5001/api`).
*   Provjerite konzolu backend servera za detaljne greške.
*   Provjerite Developer Tools u pregledniku (Network tab i Console tab) za detalje o neuspjelom zahtjevu. Pošaljite te detalje ako problem potraje.
