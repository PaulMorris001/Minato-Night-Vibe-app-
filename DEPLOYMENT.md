# NightVibe Deployment Guide

This guide covers deploying both the backend (Node.js/Express server) and frontend (React Native/Expo mobile app) for production testing.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend Deployment](#backend-deployment)
- [Mobile App Deployment](#mobile-app-deployment)
- [Testing Deployment](#testing-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Backend

- Node.js 18+ installed
- MongoDB Atlas account (or MongoDB instance)
- Server/hosting provider (Railway, Render, DigitalOcean, AWS, etc.)

### Mobile App

- Expo account (free tier works)
- Node.js 18+ installed
- iOS: Mac with Xcode (for building iOS apps)
- Android: Android Studio (optional, Expo can build in cloud)

## Environment Variables

All environment variables are centralized for easy configuration.

### Backend Environment Variables

Located in `server/.env` (see `server/.env.example` for template):

```bash
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production  # or 'development'

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=database-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration (Optional)
# Comma-separated list of allowed origins for production
# CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
# SOCKET_CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

**IMPORTANT:**

- Never commit `.env` files to git
- Generate a strong JWT_SECRET: `openssl rand -base64 32`
- Use `.env.example` as a template

### Mobile App Environment Variables

Located in `mobile/.env` (optional, see `mobile/.env.example` for template):

```bash
# Backend API Configuration
# For production, set the full URL to your deployed backend
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api

# For local development (optional - auto-detected if not set)
# EXPO_PUBLIC_API_URL=http://localhost:3000/api
# EXPO_PUBLIC_API_PORT=3000
```

**Notes:**

- If `EXPO_PUBLIC_API_URL` is not set, the app auto-detects localhost in development
- For production builds, you MUST set `EXPO_PUBLIC_API_URL` to your deployed backend URL

## Backend Deployment

### Step 1: Prepare Your Code

1. Ensure all dependencies are installed:

```bash
cd server
npm install
```

2. Test locally:

```bash
npm run dev
# Server should start at http://localhost:3000
```

3. Test production mode:

```bash
npm start
```

4. Verify health endpoint:

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"...","environment":"production"}
```

### Step 2: Database Setup

1. Create a MongoDB Atlas cluster (free tier available at mongodb.com)
2. Create a database user with read/write permissions
3. Whitelist your deployment server's IP (or use 0.0.0.0/0 for testing)
4. Copy the connection string and add to `MONGO_URI` in `.env`

### Step 3: Deploy to Hosting Provider

#### Option A: Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. In `server/` directory:

```bash
railway init
railway up
```

4. Add environment variables in Railway dashboard
5. Your backend URL will be: `https://your-app.railway.app`

#### Option B: Render

1. Create a new Web Service on render.com
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: leave blank or set to `server`
4. Add environment variables in Render dashboard
5. Your backend URL will be: `https://your-app.onrender.com`

#### Option C: DigitalOcean/AWS/Other

1. Set up a server with Node.js installed
2. Clone your repository
3. Install dependencies: `cd server && npm install`
4. Set up environment variables
5. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/index.js --name nightvibe-api
pm2 startup
pm2 save
```

6. Set up nginx as reverse proxy (optional but recommended)

### Step 4: Configure CORS for Production

Update your `.env` file with your mobile app's domain:

```bash
# If using Expo Go
CORS_ORIGIN=*

# If using custom domain
CORS_ORIGIN=https://yourdomain.com

# Multiple origins
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### Step 5: Verify Backend Deployment

```bash
# Health check
curl https://your-backend-url.com/health

# Test API endpoint
curl https://your-backend-url.com/api/cities
```

## Mobile App Deployment

### Step 1: Configure Backend URL

1. Create `mobile/.env` file:

```bash
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

2. Verify the config is working:

```bash
cd mobile
npm start
# Check console output for API URL
```

### Step 2: Update app.json

Update `mobile/app.json` with your app details:

```json
{
  "expo": {
    "name": "Nightvibe",
    "slug": "nightvibe",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourdomain.nightvibe"
    },
    "android": {
      "package": "com.yourdomain.nightvibe"
    }
  }
}
```

### Step 3: Build for Testing

#### Option A: Expo Go (Fastest for Testing)

1. Install Expo Go app on your phone (iOS/Android)
2. Start development server:

```bash
cd mobile
npm start
```

3. Scan QR code with Expo Go app
4. Test all features

#### Option B: Development Build (Recommended for Pre-Production)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login to Expo:

```bash
eas login
```

3. Configure EAS:

```bash
cd mobile
eas build:configure
```

4. Create development build:

```bash
# For iOS
eas build --profile development --platform ios

# For Android
eas build --profile development --platform android
```

5. Install the build on your device when complete

#### Option C: Production Build

1. Create production builds:

```bash
# For iOS (requires Apple Developer account)
eas build --profile production --platform ios

# For Android
eas build --profile production --platform android
```

2. Submit to app stores:

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## Testing Deployment

### Backend Testing Checklist

- [ ] Health endpoint responds: `GET /health`
- [ ] User registration works: `POST /api/register`
- [ ] User login works: `POST /api/login`
- [ ] Protected routes require authentication
- [ ] Database connection is stable
- [ ] Socket.IO connections work
- [ ] CORS allows mobile app requests

### Mobile App Testing Checklist

- [ ] App connects to backend
- [ ] User can register/login
- [ ] All API calls work correctly
- [ ] Real-time chat/socket features work
- [ ] Images upload/display correctly
- [ ] App handles offline/error states
- [ ] No console errors

### Testing Commands

```bash
# Test backend health
curl https://your-backend-url.com/health

# Test registration
curl -X POST https://your-backend-url.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test123!"}'

# Test login
curl -X POST https://your-backend-url.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

## Troubleshooting

### Backend Issues

**Database Connection Fails**

- Check `MONGO_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Check database user permissions

**CORS Errors**

- Add your domain to `CORS_ORIGIN` in `.env`
- Restart backend after changing env vars
- Check browser console for specific CORS error

**Socket.IO Not Connecting**

- Verify `SOCKET_CORS_ORIGIN` allows your domain
- Check firewall allows WebSocket connections
- Test with: `wscat -c wss://your-backend-url.com`

### Mobile App Issues

**Cannot Connect to Backend**

- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Check backend is running and accessible
- Test backend URL in browser
- Check mobile device network connection

**API Returns 401/403**

- Check JWT_SECRET matches between builds
- Verify token is being saved/sent correctly
- Check token hasn't expired

**Build Failures**

- Clear cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Expo SDK compatibility

## Quick Reference

### Useful Commands

```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev         # Development mode
npm start           # Production mode
npm run seed        # Seed database

# Mobile
cd mobile
npm install         # Install dependencies
npm start           # Start dev server
npx expo start -c   # Start with cache clear
eas build           # Build app
```

### Important URLs

- MongoDB Atlas: <https://cloud.mongodb.com>
- Expo Dashboard: <https://expo.dev>
- Railway: <https://railway.app>
- Render: <https://render.com>

### Environment Files Location

```
NightVibe/
├── server/
│   ├── .env              # Backend config (DO NOT COMMIT)
│   └── .env.example      # Backend template (commit this)
└── mobile/
    ├── .env              # Mobile config (DO NOT COMMIT)
    └── .env.example      # Mobile template (commit this)
```

## Security Checklist

Before going to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Remove development CORS wildcard (\*)
- [ ] Enable HTTPS/SSL on backend
- [ ] Review and limit database user permissions
- [ ] Set up proper error logging (not exposing stack traces)
- [ ] Enable rate limiting on API endpoints
- [ ] Review all environment variables
- [ ] Backup database regularly

## Support

For issues or questions:

- Check server logs for errors
- Review this deployment guide
- Check environment variables are set correctly
- Test each component independently
