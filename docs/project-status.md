# RedFlowerPics — Project Status

**Domain:** redflowerpics.dev
**Stack:** Vite + React (JavaScript), React Router v6
**Last Updated:** 2026-07-20

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

1. **Backend** — Node/Express API connecting to AWS S3 and a database
2. **Deployment** — configure Vite base URL and hosting for `redflowerpics.dev`
