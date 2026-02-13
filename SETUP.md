# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your system
- Make sure MongoDB service is running
- Update `backend/.env` with: `MONGODB_URI=mongodb://localhost:27017/booknest`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `backend/.env` with your Atlas connection string

### 3. Configure Environment Variables

Create `backend/.env` file:
```env
PORT=5555
MONGODB_URI=mongodb://localhost:27017/booknest
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

Create `frontend/.env` file (optional):
```env
VITE_API_URL=http://localhost:5555/api
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin: admin@booknest.com / admin123
- Customer: john@example.com / customer123
- Sample books, categories, and authors

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5555

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env` file
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change PORT in `backend/.env`
- Update `frontend/.env` with new API URL

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Build Errors
- Make sure all dependencies are installed
- Check Node.js version (v14+ required)

## Default Credentials

After seeding:
- **Admin**: admin@booknest.com / admin123
- **Customer**: john@example.com / customer123

## Next Steps

1. Login as admin to access admin panel
2. Explore the dashboard and manage books
3. Login as customer to browse and purchase books
4. Test all features including cart, checkout, and orders

