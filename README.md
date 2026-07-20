# redflowerpics

A personal photo storage web app. Users log in and can browse and upload their photos. Photos are stored in AWS S3 with database-backed references.

## Status

In active development. The frontend scaffold, login/sign-up flow, gallery page, photo upload/delete flow, and profile page are complete. Authentication is handled by Firebase. Backend and S3 integration are upcoming.

## Tech stack

- **Frontend:** React 19 (JavaScript), Vite
- **Routing:** React Router v6
- **Auth:** Firebase Authentication (email/password)
- **Storage (planned):** AWS S3 + database
- **Deployment target:** redflowerpics.dev

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

## Running locally

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Firebase project's config values (from the Firebase Console → Project settings → General → Your apps)
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`

## Project structure

```
src/
  components/
    Header.jsx          # App header with hamburger menu and logout
    Header.css
    ProtectedRoute.jsx  # Redirects unauthenticated users to /login
    UploadModal.jsx     # Modal for selecting and previewing photos before upload
    UploadModal.css
  pages/
    LoginPage.jsx     # Login form, Firebase email/password sign-in
    SignUpPage.jsx    # Sign-up form, Firebase account creation
    AuthPage.css      # Shared styles for Login and SignUp pages
    GalleryPage.jsx   # Photo grid with add and delete support
    GalleryPage.css
    ProfilePage.jsx   # User profile — avatar, real name/email, reset password
    ProfilePage.css
    ComingSoonPage.jsx  # Reusable placeholder for routes not yet active
  AuthContext.jsx     # AuthProvider + useAuth() — shares the signed-in user app-wide
  firebase.js         # Firebase init; exports `auth`
  App.jsx             # Route definitions
  main.jsx            # App entry point
  index.css           # Global styles
```

## Authentication

Auth is handled by Firebase Authentication (email/password provider). Sign up for a new account at `/signup`, or log in at `/login`. Password resets are available from the Profile page.
