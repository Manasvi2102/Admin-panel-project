# 🔧 Fix MongoDB Connection Error

## ❌ Problem:
```
Error: querySrv ENOTFOUND _mongodb._tcp.YOUR_CLUSTER_ADDRESS
```

**यह error इसलिए आ रहा है क्योंकि:**
- MONGODB_URI में `YOUR_CLUSTER_ADDRESS` placeholder है
- Actual cluster address replace नहीं हुआ है

---

## ✅ Solution: Actual Cluster Address लें

### Step 1: MongoDB Atlas में जाएं

1. **Browser में खोलें**: https://cloud.mongodb.com
2. **Login** करें
3. **Dashboard** पर जाएं

### Step 2: Cluster Address Copy करें

1. Left menu में **"Database"** पर click करें
2. आपके cluster (Cluster0) के सामने **"Connect"** button पर click करें
3. **"Connect your application"** option choose करें
4. आपको एक connection string दिखेगा:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **`cluster0.xxxxx.mongodb.net`** part copy करें
   - यह आपका **actual cluster address** है
   - Example: `cluster0.abc123.mongodb.net`

---

## Step 3: Render में Update करें

### Render Dashboard में:

1. **Your Service** → **"Environment"** tab पर click करें
2. **MONGODB_URI** variable को **Edit** करें
3. **Current (Wrong) Value:**
   ```
   mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@YOUR_CLUSTER_ADDRESS/booknest?retryWrites=true&w=majority
   ```
4. **Replace करें `YOUR_CLUSTER_ADDRESS`** अपने actual cluster address से
5. **Correct Value Example:**
   ```
   mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@cluster0.abc123.mongodb.net/booknest?retryWrites=true&w=majority
   ```
   *(Replace `cluster0.abc123.mongodb.net` with your actual cluster address)*

6. **Save** करें

---

## Step 4: Redeploy करें

1. **"Manual Deploy"** button पर click करें
2. या **"Redeploy"** option choose करें
3. **Wait 5-10 minutes**
4. Deployment successful होगा! ✅

---

## 📝 Quick Format:

**Your MONGODB_URI should be:**
```
mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@CLUSTER_ADDRESS/booknest?retryWrites=true&w=majority
```

**Where CLUSTER_ADDRESS = Your actual cluster from MongoDB Atlas**

**Example:**
```
mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@cluster0.abc123.mongodb.net/booknest?retryWrites=true&w=majority
```

---

## ✅ Checklist:

- [ ] MongoDB Atlas में cluster address copy किया
- [ ] Render में MONGODB_URI update किया (YOUR_CLUSTER_ADDRESS replace किया)
- [ ] `/booknest` database name included है
- [ ] Save किया
- [ ] Manual Deploy/Redeploy किया

---

## 🆘 अगर Cluster Address नहीं मिल रहा:

1. MongoDB Atlas → Database
2. Cluster के सामने "Connect" button
3. "Connect your application"
4. Connection string में `@cluster0.xxxxx.mongodb.net` part देखें
5. यही आपका cluster address है

---

**Cluster address update करके redeploy करें! 🚀**


