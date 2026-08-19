# RedFlowerPics — Project Status

**Domain:** redflowerpics.dev
**Stack:** Vite + React (JavaScript), React Router v6
**Last Updated:** 2026-07-29

---

## Project Overview

RedFlowerPics is a personal photo application with a web frontend accessible from both desktop and mobile browsers. Users will be able to log in, view a gallery of their photos, and upload new photos. Uploaded photos will generate a thumbnail, which is what the gallery displays. Photos will be stored in AWS S3 with a database holding references to them. The frontend is being built first using mock data; the backend will be wired in later.

---

## Design Decisions

| Decision | Detail |
|---|---|
| Language | Plain JavaScript (no TypeScript) |
| Routing | React Router v6 — `/` redirects to `/login`, `/login`, `/gallery`, `/profile` |
| Auth | Firebase Authentication (email/password provider) — sign-up, login, logout, and password reset all backed by Firebase; user session tracked via `AuthContext` |
| Photo storage | AWS S3 for files; a database will hold S3 references/keys |
| Mock data shape | `MOCK_PHOTOS` array mirrors the real API shape (`id`, `url`, `alt`) so swapping in real data only changes the data source, not the components |
| Gallery layout | `auto-fill minmax(150px, 1fr)` CSS grid — responsive across desktop and mobile without a fixed column count |
| Thumbnail display | `aspect-ratio: 1/1` + `object-fit: cover` — gallery cells are square and consistent regardless of source image dimensions |
| Color scheme | Dark theme — `#1a1a2e` page background, `#16213e` card/header background, `#c0622f` burnt orange accent |
| Header menu | Hamburger dropdown — active page item highlighted in burnt orange via `useLocation` |

---

## Session Recap

### Session 1

**Step 1 — React Scaffold**
- Initialized Vite + React project at `C:\sandbox\aaron_dev\personal\webDev\photoApp`
- Installed `react-router-dom` (React Router v6)
- Created `src/pages/LoginPage.jsx` and `src/pages/GalleryPage.jsx` as placeholder pages
- Wired routing in `src/App.jsx`: `/` → redirect to `/login`, `/login` → LoginPage, `/gallery` → GalleryPage
- Cleaned up Vite boilerplate (`App.css`, `assets/react.svg`, `index.css`)

**Step 2 — Login Form**
- Built login form with username and password fields
- `useState` tracks input values
- Mock credentials hardcoded in `LoginPage.jsx` (`admin` / `password123`)
- Successful login redirects to `/gallery` via `useNavigate`
- Failed login displays an inline error message

**Step 3 — Gallery Page**
- Displays a photo grid using a `MOCK_PHOTOS` array
- Placeholder images served from `picsum.photos`
- Initial layout used a 3-column CSS Grid with inline styles

---

### Session 2

**Step 4 — Protected Route**
- Created `src/components/ProtectedRoute.jsx` — reads `localStorage.isLoggedIn`; redirects to `/login` if not set
- `LoginPage.jsx` sets `localStorage.setItem('isLoggedIn', 'true')` on successful login
- `App.jsx` wraps the `/gallery` route with `<ProtectedRoute>`
- Verified: direct URL access to `/gallery` without auth redirects correctly; clearing `localStorage` re-enables the redirect

**Step 5 — Styling**
- `src/index.css` — global styles: dark background, base text color, `box-sizing` reset; `#root` set to flex column (`min-height: 100vh`) so header sits flush at top on all pages
- `src/pages/LoginPage.css` — card centered on page, dark input fields, burnt orange login button with hover state
- `src/pages/GalleryPage.css` — responsive auto-fill grid, square thumbnail cells using `aspect-ratio` and `object-fit: cover`

**Step 6 — Header + Logout**
- Created `src/components/Header.jsx` — full-width header bar with app title and hamburger menu
- Dropdown menu items: Gallery (active), Add Photos (disabled), Profile (disabled), Log Out
- Active item determined by `useLocation` — highlighted in burnt orange
- Log Out clears `localStorage` and navigates to `/login`
- `Header` accepts a `showMenu` prop (default `true`); Login page passes `showMenu={false}` to hide the menu while keeping the header visible
- `LoginPage` restructured to use `.login-page` (flex column) + `.login-center` (flex, centers card in remaining space) so the header sits flush at the top and the card centers below it
- `GalleryPage` uses `.gallery-page` (flex column, no outer padding) — padding applied directly to `h1` and `.photo-grid` so the header is flush with page edges

---

### Session 3

**Step 7 — Photo Upload Flow**
- `GalleryPage.jsx` converted `MOCK_PHOTOS` from a static constant to `useState` so the gallery reflects additions and deletions immediately
- Added `selectedIds` state (a `Set`) to `GalleryPage.jsx` — clicking a photo card toggles its selection; selected cards show a burnt orange outline and a ✓ badge
- Added two action buttons above the grid: **Add Photos** (opens upload modal) and **Delete Selected** (disabled when nothing is selected; shows browser `window.confirm()` with the count before removing)
- Created `src/components/UploadModal.jsx` — file picker modal with multi-file support, thumbnail previews via `URL.createObjectURL()`, running photo count, and Confirm/Cancel actions
- Created `src/components/UploadModal.css` — modal overlay, preview grid, and action button layout
- Upload appends to existing previews across multiple picker opens; confirmed photos are appended to gallery state with `Date.now()`-based IDs
- Debugged a silent render failure caused by a mismatched curly brace that wrapped the JSX return inside `handleFileChange`

---

### Session 4

**Step 8 — Profile Page + Coming Soon Placeholder**
- Created `src/pages/ProfilePage.jsx` — displays a circular SVG avatar placeholder, mock name and email, and a non-functional Reset Password button (wired up once real auth is implemented)
- Created `src/pages/ProfilePage.css` — centered card layout matching the existing dark theme; burnt orange Reset Password button consistent with other primary actions
- Created `src/pages/ComingSoonPage.jsx` — reusable placeholder page accepting a `pageName` prop; used to park routes that are built but not yet active
- `/profile` route added to `App.jsx` as a protected route, currently pointing to `ComingSoonPage` — swap to `ProfilePage` when auth is ready
- `Header.jsx` Profile button enabled: navigates to `/profile` and highlights active state in burnt orange (same pattern as Gallery)

---

### Session 5

**Step 9 — Firebase Authentication**
- Replaced mock `admin`/`password123` login with real Firebase Authentication (email/password provider)
- Installed `firebase` package; added `src/firebase.js` as the single Firebase init point, reading config from `import.meta.env.VITE_FIREBASE_*` vars (`.env`, gitignored; `.env.example` committed with placeholder keys)
- Created `src/AuthContext.jsx` — `AuthProvider` + `useAuth()` hook, subscribes once to `onAuthStateChanged` and shares `{ user, loading }` app-wide; wraps `<Routes>` in `App.jsx`
- Created `src/pages/SignUpPage.jsx` — mirrors `LoginPage.jsx` with Name (optional), Email, Password, Confirm Password fields; calls `createUserWithEmailAndPassword` and `updateProfile` for the display name; new `/signup` route
- Renamed `LoginPage.css` → `AuthPage.css`, shared by Login and SignUp pages
- `LoginPage.jsx` — `username` state replaced with `email`; `handleSubmit` calls `signInWithEmailAndPassword`; Firebase error codes mapped to inline error text; added "Sign up" link
- `ProtectedRoute.jsx` — now reads `{ user, loading }` from `useAuth()` instead of a `localStorage` flag; renders nothing while `loading` to avoid a flash-redirect on page refresh
- `Header.jsx` — `handleLogout` now calls Firebase `signOut`
- `ProfilePage.jsx` — mock user data replaced with the real signed-in `user` from `useAuth()`; Reset Password button wired to `sendPasswordResetEmail`, with a new `.success-text` style for the confirmation message
- `/profile` route in `App.jsx` swapped from `ComingSoonPage` to the real `ProfilePage` — no longer dormant
- Manual verification in-browser: sign-up, duplicate sign-up, logout/redirect, refresh-without-flash, wrong password, correct login, incognito direct-nav protection, profile displaying real data, and password reset email flow all confirmed working
- Fixed a missing `Link` import in `LoginPage.jsx` and added a specific error case for `auth/password-does-not-meet-requirements` (thrown when Firebase Console's Password Policy enforcement is enabled) alongside the default `auth/weak-password` case

---

### Session 6

**Step 10 — Backend scaffold begins (`/server`)**
- Locked-in architecture (Express + Postgres + S3) recorded in `implement_upload_backend.plan.md`: shared gallery (not private-per-user), presigned S3 PUT/GET, Firebase ID token verification via `firebase-admin`, plain numbered `.sql` migrations with a custom runner, no ORM
- Created `/server` folder structure (`src/config`, `src/middleware`, `src/routes`, `src/db/migrations`, `src/db/queries`)
- `server/package.json` — ESM (`"type": "module"`), dependencies: `express`, `cors`, `dotenv`, `pg`, `firebase-admin`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, dev dependency `nodemon`
- Provisioned a Neon Postgres project (dev database) and a Firebase service account for server-side token verification
- `server/.env` / `.env.example` — `DATABASE_URL`, `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY`, `AWS_*`/`S3_BUCKET_NAME` (S3 bucket/IAM user provisioning deferred to a later session)
- `server/src/config/env.js` — loads and validates required env vars via `dotenv`
- `server/src/config/db.js` — `pg` `Pool` using `DATABASE_URL`
- `server/src/db/migrations/001_create_categories_table.sql` and `002_create_photos_table.sql` — schema matching the locked-in plan (`owner_uid`, `s3_key`, `category_id`, `date_taken`, indexes)
- `server/src/db/migrate.js` — migration runner; tracks applied migrations in a `schema_migrations` table, applies pending `.sql` files in order inside a transaction each
- Ran `npm run migrate` against Neon — both migrations applied successfully, `categories` and `photos` tables confirmed created with seed data
- Handed off (not yet created/run): `server/src/config/firebaseAdmin.js`, `server/src/middleware/authenticate.js`, `server/src/middleware/errorHandler.js`, `server/src/routes/health.routes.js`, `server/src/app.js`, `server/src/index.js` — this is the very next step to pick up
- Found and fixed: root `.gitignore`'s `.env*` rule (no leading slash) was matching at every directory depth, silently excluding both `server/.env.example` and the root `.env.example` from any future commit — added explicit `!.env.example`-style exceptions so example templates are trackable while real `.env` files stay ignored

---

### Session 7

**Step 11 — Express app skeleton complete**
- Created `server/src/config/firebaseAdmin.js` — initializes the Firebase Admin SDK via a service account cert (`\\n` → real newline fix on the private key, since `.env` flattens multi-line PEM keys)
- Created `server/src/middleware/authenticate.js` — extracts the `Authorization: Bearer <token>` header, verifies it via `firebaseAuth.verifyIdToken`, sets `req.uid`/`req.displayName` on success, 401 on missing/invalid token
- Created `server/src/middleware/errorHandler.js` — 4-argument Express error handler, returns consistent `{ error }` JSON, defaults to 500
- Created `server/src/routes/health.routes.js` — `GET /api/health`, no auth required
- Created `server/src/app.js` — registers `cors`/`express.json()` middleware, mounts the health router at `/api/health`, registers the error handler last
- Created `server/src/index.js` — entry point, starts `app.listen(config.port)`
- User hand-wrote all six files (guided step-by-step); caught and fixed a real bug along the way — a missing trailing space in `startsWith('Bearer ')` that, combined with `slice(7)`, would have mis-sliced malformed Authorization headers instead of rejecting them
- Verified: `npm run dev` in `/server`, `curl http://localhost:4000/api/health` → `{"status":"ok"}`

### Session 8

**Step 12 — S3 provisioning + categories route**
- Provisioned the S3 bucket (private, all Block Public Access settings on, no versioning)
- Created a scoped IAM user (`photoapp-server-dev`) with an inline policy limited to `s3:PutObject`/`s3:GetObject` on the new bucket only — no broad managed policy attached
- Generated a local-dev access key ("Local code" use case); noted that EC2 deployment will use an IAM role/instance profile instead of a stored key
- Configured bucket CORS to allow `PUT`/`GET` from `http://localhost:5173` (prod origin to be added later)
- Filled in `server/.env` with the real `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` values
- Created `server/src/config/s3Client.js` — shared `S3Client` instance (region from `config.awsRegion`; credentials picked up automatically from env by the SDK), same pattern as `db.js`'s `pool`
- Created `server/src/db/queries/categories.queries.js` (`getAllCategories`) and `server/src/routes/categories.routes.js` (`GET /api/categories`, behind `authenticate`); mounted in `app.js`
- Verified: `npm run dev` + `curl http://localhost:4000/api/categories` with a real Firebase ID token (grabbed via a temporary `window.auth = auth` debug line in `firebase.js`, removed after) → returns the seeded category list

## Current File Structure

```
src/
  components/
    Header.jsx
    Header.css
    ProtectedRoute.jsx
    UploadModal.jsx
    UploadModal.css
  pages/
    LoginPage.jsx
    SignUpPage.jsx
    AuthPage.css
    GalleryPage.jsx
    GalleryPage.css
    ProfilePage.jsx
    ProfilePage.css
    ComingSoonPage.jsx
  AuthContext.jsx
  firebase.js
  App.jsx
  main.jsx
  index.css
```

---

## What's Next

1. **Photos routes** — build `GET /api/photos` (with year/category/uploader filtering + presigned GET URLs) and `DELETE /api/photos/:id` (owner-only), plus matching `db/queries/photos.queries.js`
2. **Uploads routes** — `uploads.routes.js` (`POST /api/uploads/presign`, `POST /api/uploads/confirm`), using `s3Client.js`
3. **Backend verification** — remaining manual checks from `implement_upload_backend.plan.md`'s Verification section (health check + categories confirmed so far)
4. **Frontend integration** — swap `GalleryPage.jsx`/`UploadModal.jsx` off mock data once the routes above exist
5. **Deployment** — configure Vite base URL and hosting for `redflowerpics.dev`
