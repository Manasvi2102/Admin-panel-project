# MongoDB Atlas Setup - Step by Step

## MONGODB_URI कैसे मिलेगा:

### Step 1: MongoDB Atlas Account बनाएं

1. **Browser में जाएं**: https://www.mongodb.com/cloud/atlas/register
2. **"Try Free"** या **"Sign Up"** button पर click करें
3. **Google/GitHub से sign up** करें (FREE)
4. Account बन जाएगा

---

### Step 2: Free Cluster बनाएं

1. Login के बाद **"Build a Database"** button पर click करें
2. **"FREE"** option select करें (M0 Sandbox - Free forever)
3. **Cloud Provider**: AWS (default)
4. **Region**: अपने closest region choose करें
   - Mumbai (Asia South)
   - Singapore (Asia)
   - या कोई भी nearby region
5. **Cluster Name**: Default रहने दें या `BookNest` रखें
6. **"Create"** button पर click करें
7. **3-5 minutes wait** करें (cluster बन रहा है)

---

### Step 3: Database User बनाएं

1. Cluster बनने के बाद, **"Database Access"** पर click करें (left menu)
2. **"Add New Database User"** button पर click करें
3. Fill करें:
   - **Authentication Method**: Password
   - **Username**: `booknest` (या कोई भी username)
   - **Password**: 
     - **"Autogenerate Secure Password"** click करें
     - **या manually** strong password बनाएं
     - ⚠️ **PASSWORD COPY करके SAVE करें!** (बाद में नहीं दिखेगा)
   - **Database User Privileges**: "Read and write to any database"
4. **"Add User"** button पर click करें

---

### Step 4: Network Access Allow करें

1. Left menu में **"Network Access"** पर click करें
2. **"Add IP Address"** button पर click करें
3. **"Allow Access from Anywhere"** button पर click करें
   - यह `0.0.0.0/0` automatically add कर देगा
4. **"Confirm"** button पर click करें
5. **2-3 minutes wait** करें (IP whitelist हो रहा है)

---

### Step 5: Connection String लें

1. Left menu में **"Database"** पर click करें
2. आपके cluster के सामने **"Connect"** button पर click करें
3. **"Connect your application"** option choose करें
4. **Driver**: Node.js (default)
5. **Version**: Latest (default)
6. आपको एक connection string दिखेगा:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **इस string को copy करें**

---

### Step 6: Connection String को Update करें

Copy किए गए string में:

1. **`<username>`** को replace करें अपने username से (जो आपने Step 3 में बनाया)
2. **`<password>`** को replace करें अपने password से (जो आपने Step 3 में बनाया)
3. **Database name add करें**: String के अंत में `?retryWrites=true&w=majority` से पहले `/booknest` add करें

**Final MONGODB_URI format:**
```
mongodb+srv://booknest:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://booknest:MyPassword123@cluster0.abc123.mongodb.net/booknest?retryWrites=true&w=majority
```

---

## ✅ Checklist:

- [ ] MongoDB Atlas account बना
- [ ] Free cluster बना (M0 Sandbox)
- [ ] Database user बना (username + password saved)
- [ ] Network Access: 0.0.0.0/0 allowed
- [ ] Connection string copy किया
- [ ] Connection string में username/password replace किए
- [ ] `/booknest` database name add किया

---

## 🆘 Common Issues:

### Password भूल गए?
- Database Access में जाएं
- User के सामने "Edit" → "Reset Password"
- नया password set करें
- Connection string update करें

### Connection Error?
- Network Access check करें (0.0.0.0/0 allowed होना चाहिए)
- Username/password सही है या नहीं check करें
- Cluster running है या नहीं check करें

---

## 📝 Quick Reference:

**MONGODB_URI Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority
```

**Parts:**
- `USERNAME` = आपका database username
- `PASSWORD` = आपका database password
- `cluster0.xxxxx` = आपका cluster address
- `booknest` = database name

---

**अब आपको MONGODB_URI मिल गया होगा! 🎉**

