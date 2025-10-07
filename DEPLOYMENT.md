# 🚀 ELD Trip Planner - Deployment Guide

This guide will walk you through deploying your ELD Trip Planner application to production using **Vercel** (frontend) and **Railway** (backend).

---

## 📋 **Prerequisites**

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ A Railway account (sign up at [railway.app](https://railway.app))
- ✅ Git installed on your computer

---

## 🔧 **Part 1: Prepare Your Code**

### 1. Initialize Git Repository (if not already done)

```bash
# Navigate to your project root
cd C:\Users\REALTECH\Desktop\spotter

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ELD Trip Planner"
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it: `eld-trip-planner`
4. Keep it **Public** (or Private if you prefer)
5. **DO NOT** initialize with README
6. Click **"Create repository"**

### 3. Push Code to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/eld-trip-planner.git

# Push your code
git branch -M main
git push -u origin main
```

---

## 🗄️ **Part 2: Deploy Backend to Railway**

### 1. Sign Up / Log In to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select your `eld-trip-planner` repository

### 2. Configure Django Service

1. Railway will detect it's a Python project
2. Click on your project
3. Go to **"Settings"** → **"Environment"**
4. Add the following environment variables:

```
SECRET_KEY=your-super-secret-key-here-make-it-random
DEBUG=False
ALLOWED_HOSTS=*.railway.app,*.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
DJANGO_SETTINGS_MODULE=eld_backend.settings
```

### 3. Get Your Railway Backend URL

1. In Railway, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy your Railway URL (e.g., `https://eld-backend-production.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend!

### 4. Run Database Migrations

Railway will automatically run migrations if your `Procfile` includes them. To manually run:

1. Go to Railway dashboard
2. Click on your service
3. Go to **"Settings"** → **"Deploy"**
4. Add a release command:
```
python manage.py migrate
```

---

## 🌐 **Part 3: Deploy Frontend to Vercel**

### 1. Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `eld-trip-planner` repository

### 2. Configure Build Settings

When importing, Vercel will ask for configuration:

1. **Framework Preset**: `Create React App`
2. **Root Directory**: Click **"Edit"** → Select `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### 3. Add Environment Variables

Before deploying, add environment variables:

1. Click **"Environment Variables"**
2. Add the following:

```
Name: REACT_APP_API_URL
Value: https://your-railway-backend-url.up.railway.app/api
```

**Replace** `your-railway-backend-url.up.railway.app` with the Railway URL you saved earlier!

### 4. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will give you a live URL (e.g., `https://eld-trip-planner.vercel.app`)

---

## 🔄 **Part 4: Update CORS Settings**

Now that you have both URLs, update your backend CORS settings:

### 1. Update Railway Environment Variables

Go back to Railway → Your Project → Settings → Environment Variables

Update `CORS_ALLOWED_ORIGINS`:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://eld-trip-planner.vercel.app
```

### 2. Redeploy Backend

Railway will automatically redeploy when you change environment variables.

---

## ✅ **Part 5: Verify Deployment**

### 1. Test Your Live App

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Try calculating a trip:
   - Current Location: `Entebbe`
   - Pickup Location: `Kampala`
   - Dropoff Location: `Jinja`
   - Current Cycle: `0`
3. Click **"Calculate Trip"**
4. Verify all features work:
   - ✅ Map displays with markers
   - ✅ Route instructions show
   - ✅ Daily logs generate
   - ✅ HOS compliance shows
   - ✅ Export functions work

---

## 🎉 **Success!**

Your ELD Trip Planner is now live on the internet!

### Your Live URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.up.railway.app/api`

---

## 🔧 **Troubleshooting**

### Issue: "CORS Error" in Browser Console

**Solution**: 
1. Make sure `CORS_ALLOWED_ORIGINS` in Railway includes your Vercel URL
2. Redeploy the backend
3. Clear browser cache

### Issue: "Module not found" or Build Fails

**Solution**:
1. Make sure `vercel.json` is in the `frontend` folder
2. Check that Root Directory is set to `frontend` in Vercel
3. Verify all dependencies are in `package.json`

### Issue: Backend Returns 500 Error

**Solution**:
1. Check Railway logs: Dashboard → Your Service → "View Logs"
2. Make sure all environment variables are set
3. Verify database migrations ran successfully

### Issue: Map Not Showing

**Solution**:
1. Check browser console for API errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Make sure backend is accessible (visit backend URL directly)

---

## 🔄 **Updating Your Deployment**

### To Update Frontend:
```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```
Vercel will automatically redeploy!

### To Update Backend:
```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```
Railway will automatically redeploy!

---

## 📱 **Share Your App**

Your app is now live! Share it with:
- Potential employers
- Colleagues
- Your portfolio

**Example share text**:
> "Check out my ELD Trip Planner - a full-stack Hours of Service compliance application built with Django & React! 🚛📋
> 
> Live Demo: https://your-app.vercel.app
> 
> Features:
> ✅ Real-time HOS calculations
> ✅ DOT-compliant daily logs
> ✅ Interactive route mapping
> ✅ Global city coverage"

---

## 🎓 **What You Built**

Congratulations! You've deployed a production-ready application with:

- ✅ **Frontend**: React with modern UI/UX
- ✅ **Backend**: Django REST API
- ✅ **Database**: SQLite (can be upgraded to PostgreSQL)
- ✅ **Hosting**: Vercel + Railway
- ✅ **CI/CD**: Automatic deployments from GitHub
- ✅ **CORS**: Properly configured for cross-origin requests
- ✅ **Environment Variables**: Secure configuration management

**This is a complete, professional-grade web application!** 🎊

---

## 📞 **Need Help?**

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

---

**Happy Deploying!** 🚀

