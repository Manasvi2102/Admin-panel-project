# 🚀 Render पर Web Service बनाने की Complete Guide

## Step-by-Step Instructions (हिंदी में)

---

## STEP 1: Render Account बनाएं

1. **Browser में जाएं**: https://render.com
2. **"Get Started for Free"** या **"Sign Up"** button पर click करें
3. **"Continue with GitHub"** पर click करें
4. GitHub account से authorize करें
5. आपका Render account बन जाएगा

---

## STEP 2: Dashboard पर जाएं

1. Login के बाद आप **Dashboard** पर पहुंच जाएंगे
2. Left side में **"Dashboard"** menu दिखेगा

---

## STEP 3: New Web Service बनाएं

1. **Top right corner** में **"New +"** button दिखेगा
2. **"New +"** पर click करें
3. Dropdown menu में **"Web Service"** option select करें
   - या direct: https://dashboard.render.com/new/web-service

---

## STEP 4: GitHub Repository Connect करें

1. **"Connect a repository"** section में:
   - अगर पहली बार है, तो **"Configure account"** पर click करें
   - GitHub से authorize करें
   - **"Install Render"** पर click करें
   - **"Only select repositories"** choose करें
   - **"Admin-panel-project"** repository select करें
   - **"Install"** पर click करें

2. अब **"Connect account"** या **"Connect repository"** button दिखेगा
3. **"Admin-panel-project"** repository select करें
4. **"Connect"** पर click करें

---

## STEP 5: Service Configuration

अब आपको एक form दिखेगा, इसमें ये fill करें:

### Basic Settings:

```
Name: booknest-backend
```

```
Region: (आपके closest region को choose करें)
- Singapore (Asia)
- Frankfurt (Europe)  
- Oregon (US)
```

```
Branch: main
```

```
Root Directory: backend
(यह बहुत important है! सिर्फ "backend" लिखें)
```

```
Runtime: Node
```

```
Build Command: npm install
```

```
Start Command: npm start
```

---

## STEP 6: Environment Variables Add करें

1. **"Advanced"** section पर click करें (form के नीचे)
2. **"Environment Variables"** section में click करें
3. नीचे दिए गए variables add करें:

### Variable 1: MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://booknest:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority
```
*(अपना MongoDB connection string paste करें)*

### Variable 2: JWT_SECRET
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-make-it-very-long-and-random-123456789
```
*(कोई भी long random string, जैसे: `booknest-secret-key-2024-production-xyz123`)*

### Variable 3: JWT_EXPIRE
```
Key: JWT_EXPIRE
Value: 7d
```

### Variable 4: PORT
```
Key: PORT
Value: 10000
```
*(Render automatically PORT set करता है, लेकिन 10000 safe है)*

### Variable 5: NODE_ENV
```
Key: NODE_ENV
Value: production
```

---

## STEP 7: Plan Select करें

1. **"Plan"** section में:
   - **"Free"** plan select करें (Free tier available है)
   - या अगर paid चाहिए तो "Starter" choose करें

---

## STEP 8: Deploy करें

1. सभी fields check करें:
   - ✅ Name: booknest-backend
   - ✅ Root Directory: backend
   - ✅ Build Command: npm install
   - ✅ Start Command: npm start
   - ✅ Environment Variables: सभी 5 variables add किए गए हैं

2. **"Create Web Service"** button पर click करें

---

## STEP 9: Deployment Wait करें

1. Deployment शुरू हो जाएगा
2. आपको **"Building"** status दिखेगा
3. **5-10 minutes** wait करें
4. Status **"Live"** होने पर deployment complete है

---

## STEP 10: Backend URL Copy करें

1. Deployment complete होने के बाद
2. Page के **top** में आपको URL दिखेगा:
   ```
   https://booknest-backend.onrender.com
   ```
3. **इस URL को copy करें और save करें!**
4. यह आपका backend URL है

---

## ✅ Success Checklist

- [ ] Render account बना
- [ ] GitHub repository connect किया
- [ ] Web Service created
- [ ] Root Directory: `backend` set किया
- [ ] Environment variables add किए (5 variables)
- [ ] Deployment complete
- [ ] Backend URL copy किया

---

## 🆘 Common Issues & Solutions

### Issue 1: "Repository not found"
**Solution**: GitHub में Render app install करें (Step 4 देखें)

### Issue 2: "Build failed"
**Solution**: 
- Check Root Directory: `backend` है या नहीं
- Check Build Command: `npm install` है या नहीं
- Logs check करें (Service → Logs tab)

### Issue 3: "Application error"
**Solution**:
- Environment variables check करें
- MongoDB URI सही है या नहीं
- Logs में error देखें

### Issue 4: "Port already in use"
**Solution**: PORT variable `10000` set करें

---

## 📸 Visual Guide (What You'll See)

```
Render Dashboard
├── New + (top right)
    └── Web Service
        ├── Connect Repository
        │   └── Admin-panel-project
        ├── Basic Settings
        │   ├── Name: booknest-backend
        │   ├── Region: [Select]
        │   ├── Branch: main
        │   ├── Root Directory: backend ⚠️ IMPORTANT
        │   ├── Runtime: Node
        │   ├── Build Command: npm install
        │   └── Start Command: npm start
        ├── Advanced (click to expand)
        │   └── Environment Variables
        │       ├── MONGODB_URI
        │       ├── JWT_SECRET
        │       ├── JWT_EXPIRE
        │       ├── PORT
        │       └── NODE_ENV
        └── Create Web Service (button)
```

---

## 🎯 Quick Reference

**Required Settings:**
- Name: `booknest-backend`
- Root Directory: `backend` ⚠️
- Build: `npm install`
- Start: `npm start`

**Required Environment Variables:**
1. `MONGODB_URI` = Your MongoDB connection string
2. `JWT_SECRET` = Random secret key
3. `JWT_EXPIRE` = `7d`
4. `PORT` = `10000`
5. `NODE_ENV` = `production`

---

## 📞 Next Steps

Backend deploy होने के बाद:
1. Backend URL note करें
2. Frontend deploy करें (Vercel)
3. Frontend में `VITE_API_URL` set करें = `https://your-backend-url.onrender.com/api`

---

**Good Luck! 🚀**

