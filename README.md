# redflowerpics

A personal photo storage web app. Users log in and can browse and upload their photos. Photos are stored in AWS S3 with database-backed references.

## Status

In active development. The frontend scaffold, login/sign-up flow, gallery page, photo upload/delete flow, and profile page are complete. Authentication is handled by Firebase. Backend work: `/server` has a working Express app with Postgres (Neon) migrations, Firebase Admin token verification middleware, a provisioned S3 bucket + scoped IAM user, and verified `GET /api/health`/`GET /api/categories` endpoints. `GET /api/photos` (list, no filters yet), `DELETE /api/photos/:id` (owner-only), and the full upload pipeline (`POST /api/uploads/presign` + `POST /api/uploads/confirm`) are done and verified end-to-end via curl (presign → real S3 PUT → confirm → row in Postgres → shows up in the list). The frontend is now wired to this backend end-to-end — `GalleryPage.jsx` lists/deletes real photos and `UploadModal.jsx` runs the real upload flow (EXIF extraction, category selection, presign → S3 PUT → confirm) via a shared `src/api.js` fetch layer. No mock data remains. Query-param filtering on `GET /api/photos` (and the filter UI it unblocks) is next, then deployment. See `docs/project-status.md` for the running session log and a list of deferred post-prod items.

## Tech stack

- **Frontend:** React 19 (JavaScript), Vite
- **Routing:** React Router v6
- **Auth:** Firebase Authentication (email/password); server-side verified via `firebase-admin`
- **Backend:** Node/Express (`/server`), plain ESM, no ORM
- **Database:** PostgreSQL — Neon (dev), AWS RDS (prod)
- **Storage:** AWS S3, presigned uploads/downloads (client uploads directly to S3 via a presigned URL)
- **EXIF extraction:** `exifr` (client-side, pulls `DateTimeOriginal` before upload)
- **Deployment target:** redflowerpics.dev

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ or v22.12+ (required by Vite 8 — v18 will throw a `CustomEvent is not defined` error on startup)
- npm (comes with Node)
- The backend (`/server`) running locally too — the gallery/upload flow now depends on it, not mock data. See the "Backend (`/server`)" section below for its own setup.

## Running locally

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Firebase project's config values (from the Firebase Console → Project settings → General → Your apps), plus `VITE_API_BASE_URL` (the backend's URL, e.g. `http://localhost:4000` for local dev)
4. Start the backend in a separate terminal (`cd server && npm run dev`) — see `/server`'s own `.env.example` for its required vars
5. Start the frontend development server:
   ```
   npm run dev
   ```
6. Open your browser to `http://localhost:5173`

## Project structure

```
src/
  components/
    Header.jsx          # App header with hamburger menu and logout
    Header.css
    ProtectedRoute.jsx  # Redirects unauthenticated users to /login
    UploadModal.jsx     # Photo upload modal — category select, EXIF date extraction, and the
                        # real presign -> S3 PUT -> confirm upload flow via api.js
    UploadModal.css
  pages/
    LoginPage.jsx     # Login form, Firebase email/password sign-in
    SignUpPage.jsx    # Sign-up form, Firebase account creation
    AuthPage.css      # Shared styles for Login and SignUp pages
    GalleryPage.jsx   # Photo grid — fetches real photos via api.js, add/delete backed by the API
    GalleryPage.css
    ProfilePage.jsx   # User profile — avatar, real name/email, reset password
    ProfilePage.css
    ComingSoonPage.jsx  # Reusable placeholder for routes not yet active
  AuthContext.jsx     # AuthProvider + useAuth() — shares the signed-in user app-wide
  firebase.js         # Firebase init; exports `auth`
  api.js              # Fetch wrapper for the Express API — attaches Firebase ID token,
                       # exposes getPhotos/deletePhoto/getCategories/presignUpload/confirmUpload/
                       # uploadFileToS3, plus a useApi() hook that binds the current user
  App.jsx             # Route definitions
  main.jsx            # App entry point
  index.css           # Global styles
```

## Authentication

Auth is handled by Firebase Authentication (email/password provider). Sign up for a new account at `/signup`, or log in at `/login`. Password resets are available from the Profile page.

## Backend (`/server`)

Node/Express API backed by PostgreSQL (Neon in dev, AWS RDS in prod) and AWS S3 for photo storage. Firebase ID tokens issued to the frontend are verified server-side via `firebase-admin` — there is no separate login system.

```
server/
  src/
    config/
      env.js            # loads/validates process.env
      db.js             # pg Pool
      firebaseAdmin.js  # Firebase Admin SDK init (service account)
      s3Client.js       # shared S3Client instance (credentials from env, auto-picked up by the SDK)
    middleware/
      authenticate.js   # verifies Firebase ID token -> req.uid/req.displayName
      errorHandler.js   # catch-all JSON error responses
    routes/
      health.routes.js      # GET /api/health, no auth
      categories.routes.js  # GET /api/categories, behind authenticate
      photos.routes.js       # GET /api/photos (no filters yet), DELETE /api/photos/:id, behind authenticate
    db/
      migrations/   # numbered .sql files
      migrate.js    # migration runner (tracks applied migrations in schema_migrations)
      queries/
        categories.queries.js  # getAllCategories
        photos.queries.js       # getAllPhotos, deletePhoto, insertPhoto, getPhotoById
    routes/
      uploads.routes.js      # POST /api/uploads/presign, POST /api/uploads/confirm, behind authenticate
    app.js          # express app + middleware + route mounting
    index.js         # entry point, starts the listener
  .env.example       # server-side env vars (DATABASE_URL, Firebase Admin creds, AWS/S3)
```

Status: migrations run cleanly against Neon (`categories` and `photos` tables exist with seed data). Express app skeleton is up and verified (`GET /api/health` → `{"status":"ok"}`, `GET /api/categories` → seeded list with a valid Firebase ID token). S3 bucket + scoped IAM user are provisioned (CORS configured for the local Vite origin). `GET /api/photos` (list, presigned URLs, no filters yet), `DELETE /api/photos/:id` (owner-only), and the full upload pipeline (`presign`/`confirm`) are done and verified end-to-end via curl. Year/category/uploader filtering on `GET /api/photos` is next — see `implement_upload_backend.plan.md`.
