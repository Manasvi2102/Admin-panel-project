# 🔧 How to Fix MongoDB Connection Error

Your application is failing to start because of a **MongoDB Authentication Error** (`MongoServerError: bad auth : authentication failed`).

This means the **username** or **password** in your connection string is incorrect, or your IP address is not whitelisted.

## 🛠️ Step 1: Verify Credentials

1. Open your `.env` file in `backend/`.
2. Look at the `MONGODB_URI`:
   ```properties
   MONGODB_URI=mongodb+srv://jayantithakor585:p1qo7aSx3v0TJanY@cluster0.9qtytn2.mongodb.net/BookNest_DB?appName=Cluster0
   ```
3. **Action:**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
   - Go to **Database Access** (under Security in the left sidebar).
   - Find the user `jayantithakor585`.
   - Click **Edit** -> **Edit Password**.
   - **Set a new password** (e.g., `MySecurePassword123!`).
   - Update your `.env` file with the NEW password:
     ```properties
     MONGODB_URI=mongodb+srv://jayantithakor585:MySecurePassword123!@cluster0.9qtytn2.mongodb.net/BookNest_DB?appName=Cluster0
     ```

## 🌐 Step 2: Whitelist Your IP

Even if the password is correct, Atlas will reject connections from unknown IP addresses.

1. Go to **Network Access** (under Security in the left sidebar).
2. Click **+ Add IP Address**.
3. Select **Allow Access from Anywhere** (0.0.0.0/0).
   - *Note: This is temporary for development. For production, whitelist only your server's IP.*
4. Click **Confirm**.
5. Wait 1-2 minutes for changes to deploy.

## 🧪 Step 3: Test Connection

I have created a special test script for you. Run this in your terminal to checks connection *without* starting the whole server:

```bash
cd backend
npm install # Ensure dependencies are installed
node scripts/test-db.js
```

If it prints `✅ Connection Successful!`, you are ready to go!

## 🚀 Step 4: Start Server

Once the test script passes, start your server:

```bash
npm run dev
```
