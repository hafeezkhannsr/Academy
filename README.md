# Student Registration & Attendance System

This project includes:
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite)
- Admin dashboard with charts

Quick start (server):
1. cd server
2. copy `.env.example` to `.env` and set MONGO_URI
3. npm install
4. npm run seed
5. npm run dev

Quick start (client):
1. cd client
2. npm install
3. npm run dev

Backend API endpoints:
- POST /api/register
- POST /api/attendance
- GET /api/students
- GET /api/attendances/:studentId

Deployment (GitHub + Vercel)

1. Create a GitHub repository and push the project root (all files) to GitHub:

```powershell
cd 'c:\Users\hafee\Desktop\from'
git init
git add .
git commit -m "Initial commit - student attendance system"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

2. Frontend deployment on Vercel

- Go to vercel.com and sign in with GitHub. Create a new project and import the repository you pushed.
- For the frontend, select the `client` folder as the root directory when configuring the Vercel import (set "Root Directory" to `client`).
- Build command: `npm run build` (Vite)
- Output directory: `dist`
- The provided `client/vercel.json` helps route SPA properly.

3. Backend hosting options

- Option A (recommended): Use a dedicated Node host like Render, Railway, or Fly.io. These platforms provide persistent Node servers and you can set environment variables there (MONGO_URI, JWT_SECRET, etc.).
- Option B: Deploy backend as serverless functions on Vercel. This requires refactoring `server/` routes into serverless functions under `api/`.

4. Environment variables

Set the following env variables in your backend host (Render/Railway/Vercel if serverless):
- MONGO_URI - MongoDB connection string (MongoDB Atlas or self-hosted)
- JWT_SECRET - a long random secret
- SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD - if you plan to re-run seed on the host (not required)

5. Seed and test

- After deploying the backend, run the seed script locally (or on the host if supported) to create initial courses and admin user:

```powershell
cd 'c:\Users\hafee\Desktop\from\server'
npm install
copy .env.example .env
# modify .env to include MONGO_URI and JWT_SECRET
npm run seed
```

6. Update frontend environment (if you host backend elsewhere)

- In the frontend, update API base URLs if backend is hosted at a different domain. You can set `VITE_API_URL` and use it in the client code (not yet added). By default the client talks to `http://localhost:4000` during development.

If you want, I can:
- Add a `VITE_API_URL` env configuration to the client and use it throughout the React app.
- Create a simple `vercel.json` in the project root to redirect API calls if backend is hosted under the same domain.

Backend deployment example (Render)

- Create an account on Render (render.com) and create a new Web Service.
- Connect your GitHub repo and choose the `server` directory as the root for the service.
- Set the build/start commands:
	- Build command: `npm install`
	- Start command: `npm start` (or `npm run dev` for dev)
- Add environment variables in the Render dashboard: `MONGO_URI`, `JWT_SECRET`.

Use MongoDB Atlas for a managed MongoDB instance:
- Create a free cluster on https://www.mongodb.com/cloud/atlas
- Create a database user and whitelist your server's IP or allow access from anywhere (0.0.0.0/0) for testing.
- Use the provided connection string as `MONGO_URI`.

