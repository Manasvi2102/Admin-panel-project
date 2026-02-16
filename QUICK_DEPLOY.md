# 🚀 Quick Deployment Guide

## Step 1: MongoDB Atlas Setup (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub (free)
3. Create a FREE cluster (M0 Sandbox)
4. Wait 3-5 minutes for cluster to be ready
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<password>` with a password you'll create
8. Go to "Database Access" → "Add New Database User"
   - Username: `booknest`
   - Password: (create a strong password)
9. Go to "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
10. Your MongoDB URI will be: `mongodb+srv://booknest:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority`

---

## Step 2: Backend Deployment - Render (10 minutes)

### Option A: Using Web Interface (Easier)

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Admin-panel-project`
4. Fill in:
   - **Name**: `booknest-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Advanced" and add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://booknest:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority
   JWT_SECRET = any-random-secret-key-here-make-it-long
   JWT_EXPIRE = 7d
   PORT = 10000
   NODE_ENV = production
   ```
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://booknest-backend.onrender.com`)

### Option B: Using CLI

```powershell
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy (from project root)
cd backend
render deploy
```

---

## Step 3: Frontend Deployment - Vercel (5 minutes)

### Option A: Using Web Interface (Easier)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `Admin-panel-project`
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Click "Environment Variables" and add:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```
   (Replace with your actual backend URL from Step 2)
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your app is live! Copy the URL (e.g., `https://admin-panel-project.vercel.app`)

### Option B: Using CLI

```powershell
# Install Vercel CLI (already installed)
# Login
vercel login

# Deploy (from frontend directory)
cd frontend
vercel --prod

# When asked for environment variables, add:
# VITE_API_URL = https://your-backend-url.onrender.com/api
```

---

## Step 4: Test Your Deployment

1. Open your frontend URL in browser
2. Try to register a new user
3. Check if it connects to backend
4. If errors, check:
   - Browser console (F12)
   - Backend logs on Render
   - Frontend logs on Vercel

---

## Troubleshooting

### Backend not connecting?
- Check MongoDB URI is correct
- Verify all environment variables are set
- Check Render logs for errors

### Frontend can't reach backend?
- Verify `VITE_API_URL` includes `/api` at the end
- Check CORS settings (should be enabled)
- Verify backend URL is correct

### MongoDB connection error?
- Check IP whitelist includes 0.0.0.0/0
- Verify username/password in connection string
- Check cluster is running

---

## Quick Commands Reference

```powershell
# Backend (Render)
cd backend
render deploy

# Frontend (Vercel)
cd frontend
vercel --prod

# Check deployment status
vercel ls
```

---

## Need Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. Check platform logs:
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Logs
3. Check browser console for frontend errors

