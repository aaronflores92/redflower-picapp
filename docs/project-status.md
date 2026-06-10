# RedFlowerPics — Project Status

**Domain:** redflowerpics.dev
**Stack:** Vite + React (JavaScript), React Router v6
**Last Updated:** 2026-06-10

---

## Project Overview

RedFlowerPics is a personal photo application with a web frontend accessible from both desktop and mobile browsers. Users will be able to log in, view a gallery of their photos, and upload new photos. Uploaded photos will generate a thumbnail, which is what the gallery displays. Photos will be stored in AWS S3 with a database holding references to them. The frontend is being built first using mock data; the backend will be wired in later.

---

## Design Decisions

| Decision | Detail |
|---|---|
| Language | Plain JavaScript (no TypeScript) |
| Routing | React Router v6 — `/` redirects to `/login`, `/login`, `/gallery` |
| Auth (current) | `localStorage` flag (`isLoggedIn`) set on successful login, cleared on logout |
| Auth (planned) | JWT or session-based auth to replace the mock credentials |
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

## Current File Structure

```
src/
  components/
    Header.jsx
    Header.css
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    LoginPage.css
    GalleryPage.jsx
    GalleryPage.css
  App.jsx
  main.jsx
  index.css
```

---

## What's Next

1. **Photo upload flow** — UI for selecting and uploading photos; each upload will generate a thumbnail used in the gallery
2. **Profile page** — basic user profile page wired to the Profile menu option in the header
3. **Backend** — Node/Express API connecting to AWS S3 and a database
4. **Real auth** — replace mock credentials with JWT or session-based authentication
5. **Deployment** — configure Vite base URL and hosting for `redflowerpics.dev`
