# Deployment Guide for BookNest

This guide will help you deploy the BookNest bookstore application to production.

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database. Options:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
   - Any MongoDB hosting service

2. **GitHub Account**: For connecting repositories to deployment platforms

---

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

1. **Sign up/Login** to [Render](https://render.com)

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `Admin-panel-project`
   - Set the following:
     - **Name**: `booknest-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render uses this port)
   - `MONGODB_URI` = Your MongoDB connection string (from MongoDB Atlas)
   - `JWT_SECRET` = A strong random secret key (generate one)
   - `JWT_EXPIRE` = `7d`

4. **Deploy**: Click "Create Web Service"

5. **Note your backend URL**: It will be something like `https://booknest-backend.onrender.com`

### Option 2: Deploy to Railway

1. **Sign up/Login** to [Railway](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**:
   - Set Root Directory to `backend`
   - Railway will auto-detect Node.js

4. **Set Environment Variables**:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = A strong random secret key
   - `JWT_EXPIRE` = `7d`
   - `PORT` = Will be auto-set by Railway

5. **Deploy**: Railway will automatically deploy

6. **Note your backend URL**: It will be something like `https://booknest-backend.up.railway.app`

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Sign up/Login** to [Vercel](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**:
   - `VITE_API_URL` = Your backend URL (e.g., `https://booknest-backend.onrender.com/api`)

5. **Deploy**: Click "Deploy"

6. **Your frontend will be live**: Something like `https://admin-panel-project.vercel.app`

### Option 2: Deploy to Netlify

1. **Sign up/Login** to [Netlify](https://netlify.com)

2. **Add New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` = Your backend URL (e.g., `https://booknest-backend.onrender.com/api`)

5. **Deploy**: Click "Deploy site"

---

## MongoDB Atlas Setup (If using)

1. **Create Account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a Cluster** (Free tier M0 is fine)

3. **Create Database User**:
   - Go to Database Access
   - Add new user with username/password

4. **Whitelist IP Address**:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (for all IPs, or specific ones)

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority`

---

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Frontend can connect to backend (check browser console)
- [ ] MongoDB connection is working
- [ ] Test user registration/login
- [ ] Test book CRUD operations

---

## Troubleshooting

### Backend Issues:
- Check if MongoDB URI is correct
- Verify all environment variables are set
- Check deployment logs for errors

### Frontend Issues:
- Verify `VITE_API_URL` points to your backend URL
- Check browser console for CORS errors
- Ensure backend URL includes `/api` at the end

### CORS Issues:
- Backend should have CORS enabled (already configured in `index.js`)
- Make sure frontend URL is allowed in backend CORS settings if needed

---

## Quick Deploy Commands

After setting up the platforms, you can also deploy via CLI:

### Render CLI:
```bash
npm install -g render-cli
render deploy
```

### Vercel CLI:
```bash
npm install -g vercel
cd frontend
vercel
```

### Netlify CLI:
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

---

## Support

If you encounter issues, check:
1. Deployment platform logs
2. Browser console for frontend errors
3. Backend logs for API errors
4. MongoDB Atlas connection status

