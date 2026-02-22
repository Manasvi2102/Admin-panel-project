# Your MongoDB Connection String

## Your Credentials:
- **Username**: `manasvijetavat6_db_user`
- **Password**: `HyEBMcEti1BO41AR`

---

## Step 1: Cluster Address लें

1. MongoDB Atlas dashboard में जाएं
2. Left menu में **"Database"** पर click करें
3. आपके cluster के सामने **"Connect"** button पर click करें
4. **"Connect your application"** choose करें
5. आपको connection string दिखेगा जैसे:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **`cluster0.xxxxx.mongodb.net`** part copy करें (यह आपका cluster address है)

---

## Step 2: Final Connection String बनाएं

आपका **MONGODB_URI** होगा:

```
mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@CLUSTER_ADDRESS/booknest?retryWrites=true&w=majority
```

**Replace करें:**
- `CLUSTER_ADDRESS` = आपका cluster address (Step 1 से)

**Example:**
```
mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@cluster0.abc123.mongodb.net/booknest?retryWrites=true&w=majority
```

---

## Step 3: Render में Add करें

Render dashboard में:
1. Your service → **"Environment"** tab
2. **"Add Environment Variable"** click करें
3. Add करें:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@YOUR_CLUSTER_ADDRESS/booknest?retryWrites=true&w=majority
   ```

---

## ⚠️ Important Notes:

1. **Password में special characters** हो सकते हैं - URL encode करना पड़ सकता है
2. **Database name**: `/booknest` add करना न भूलें
3. **Network Access**: 0.0.0.0/0 allowed होना चाहिए
4. **Cluster address**: `cluster0.xxxxx.mongodb.net` format में होगा

---

## 🔍 Quick Check:

अगर connection string सही है, तो format होगा:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority
```

✅ Username: `manasvijetavat6_db_user`
✅ Password: `HyEBMcEti1BO41AR`
✅ Database: `booknest`
✅ Cluster: `cluster0.xxxxx.mongodb.net` (आपका address)

