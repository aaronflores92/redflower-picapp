# redflowerpics

A personal photo storage web app. Users log in and can browse and upload their photos. Photos are stored in AWS S3 with database-backed references.

## Status

In active development. The frontend scaffold, login flow, and gallery page are complete. Backend, authentication, and S3 integration are upcoming.

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
  pages/
    LoginPage.jsx     # Login form with credential validation
    GalleryPage.jsx   # Photo grid display
  App.jsx             # Route definitions
  main.jsx            # App entry point
```

## Current mock credentials

While the backend is not yet connected, use these to log in locally:

- **Username:** admin
- **Password:** password123
