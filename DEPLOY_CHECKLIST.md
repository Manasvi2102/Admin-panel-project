# ✅ Pre-Deployment Checklist

## Environment Variables (Render में check करें):

### Required Variables:
- [ ] **MONGODB_URI** = `mongodb+srv://manasvijetavat6_db_user:HyEBMcEti1BO41AR@cluster0.xxxxx.mongodb.net/booknest?retryWrites=true&w=majority`
- [ ] **JWT_SECRET** = `08b0c6ad9d2faad22f0c0107b11cb775e2478bd7e153ad4e027c80bd242719d0`
- [ ] **JWT_EXPIRE** = `7d`
- [ ] **PORT** = `10000`
- [ ] **NODE_ENV** = `production`

### Service Settings:
- [ ] **Root Directory**: `backend`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Branch**: `main`

---

## Deploy करने के Steps:

1. ✅ सभी environment variables check करें
2. ✅ Settings verify करें
3. ✅ "Create Web Service" या "Save Changes" click करें
4. ⏳ 5-10 minutes wait करें
5. ✅ Deployment complete होने पर URL check करें

---

## Deployment के बाद:

1. **Backend URL** copy करें (जैसे: `https://booknest-backend.onrender.com`)
2. **Logs check** करें (अगर error हो)
3. **Test करें**: Browser में backend URL खोलें
4. **Frontend deploy** करें (अगले step)

---

**Ready to deploy! 🚀**

