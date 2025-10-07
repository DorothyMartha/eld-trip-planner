# ⚡ Quick Deploy Reference

## 🚀 **Deploy in 5 Steps**

### **1️⃣ Push to GitHub**
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/eld-trip-planner.git
git push -u origin main
```

---

### **2️⃣ Deploy Backend to Railway**

1. Go to [railway.app](https://railway.app)
2. **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select `eld-trip-planner`
4. Add environment variables:
   ```
   SECRET_KEY=generate-a-random-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=*.railway.app,*.vercel.app
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. **Generate Domain** in Settings → Networking
6. **Copy the Railway URL** (e.g., `https://eld-backend.up.railway.app`)

---

### **3️⃣ Deploy Frontend to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. **"Add New..."** → **"Project"**
3. Import `eld-trip-planner`
4. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-url.up.railway.app/api
   ```
6. Click **"Deploy"**

---

### **4️⃣ Update CORS**

Go back to Railway → Your Project → Settings → Environment Variables

Update `CORS_ALLOWED_ORIGINS`:
```
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

---

### **5️⃣ Test Your Live App**

Open: `https://your-app.vercel.app`

Try:
- Current: `Entebbe`
- Pickup: `Kampala`
- Dropoff: `Jinja`
- Cycle: `0`

Click **"Calculate Trip"** ✅

---

## 🔄 **Update Deployment**

```bash
# Make changes
git add .
git commit -m "Update: your changes"
git push origin main
```

**Both Vercel and Railway will auto-deploy!** 🎉

---

## 📱 **Share Your Live App**

```
🚛 ELD Trip Planner - Live Demo

✅ Real-time HOS calculations
✅ DOT-compliant daily logs  
✅ Interactive route mapping

👉 https://your-app.vercel.app
```

---

## ❗ **Troubleshooting**

### CORS Error?
- Update `CORS_ALLOWED_ORIGINS` in Railway
- Include your exact Vercel URL

### Build Failed?
- Check `vercel.json` is in `frontend/` folder
- Verify Root Directory = `frontend` in Vercel

### Backend 500 Error?
- Check Railway logs
- Verify all environment variables are set
- Run migrations

---

**That's it! Your app is live!** 🎊

