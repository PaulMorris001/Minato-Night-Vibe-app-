# NightVibe Backend - Render Deployment Guide

## Quick Deploy

### 1. Build Command
```
npm install
```

### 2. Start Command
```
npm start
```

### 3. Environment Variables (Add these in Render Dashboard)

**Required:**
```
MONGO_URI=mongodb+srv://setemiloye_db_user:mmcgpbA1hq7hs75L@nightvibe-db.hu7svdb.mongodb.net/?appName=nightvibe-db
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

**Optional:**
```
CORS_ORIGIN=*
SOCKET_CORS_ORIGIN=*
JWT_EXPIRES_IN=7d
```

### 4. Generate Secure JWT Secret

Run this command to generate a secure JWT secret:
```bash
openssl rand -base64 32
```

Then use that output as your `JWT_SECRET` value in Render.

## Important Notes

- ✅ Your backend is ready to deploy
- ✅ MongoDB is cloud-hosted (no changes needed)
- ✅ All routes are configured correctly
- ⚠️ **MUST** change `JWT_SECRET` to a secure value before deploying
- ⚠️ Make sure to update your mobile app's `BASE_URL` to your Render URL after deployment

## After Deployment

1. Get your Render URL (e.g., `https://nightvibe-api.onrender.com`)
2. Update mobile app constant: `/mobile/constants/constants.ts`
3. Change `BASE_URL` from `http://172.20.10.2:3000/api` to `https://your-render-url.onrender.com/api`
4. Test your app with the new backend URL

## Health Check

Your backend has a health check endpoint at `/health` that Render can use to monitor your service.

## Database

Your MongoDB Atlas database is already configured and will work automatically with Render.
