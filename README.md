# redflowerpics

A personal photo storage web app. Users log in and can browse and upload their photos. Photos are stored in AWS S3 with database-backed references.

## Status

In active development. The frontend scaffold, login flow, gallery page, and photo upload/delete flow are complete. Backend, authentication, and S3 integration are upcoming.

## Tech stack

- **Frontend:** React 19 (JavaScript), Vite
- **Routing:** React Router v6
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
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

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
    LoginPage.jsx     # Login form with credential validation
    LoginPage.css
    GalleryPage.jsx   # Photo grid with add and delete support
    GalleryPage.css
  App.jsx             # Route definitions
  main.jsx            # App entry point
  index.css           # Global styles
```

## Current mock credentials

While the backend is not yet connected, use these to log in locally:

- **Username:** admin
- **Password:** password123
