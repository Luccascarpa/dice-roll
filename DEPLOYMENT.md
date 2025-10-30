# 🚀 Deploying Virtual Dice to Vercel

This guide will walk you through deploying the Virtual Dice app to Vercel.

## Important Note About Socket.io and Vercel

⚠️ **Vercel's serverless functions have limitations with WebSocket connections (Socket.io)**. For production deployment, you have two options:

### Option 1: Split Deployment (Recommended)
- Deploy the **client** on Vercel
- Deploy the **server** on a platform that supports WebSockets:
  - **Railway** (recommended): https://railway.app/
  - **Render**: https://render.com/
  - **Heroku**: https://heroku.com/
  - **DigitalOcean**: https://digitalocean.com/

### Option 2: Deploy Everything on Railway/Render
- Deploy both client and server on Railway or Render
- These platforms support WebSockets natively

## Recommended: Client on Vercel + Server on Railway

### Step 1: Deploy Server to Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `dice-roll` repository
5. Railway will detect the server automatically
6. **Configure the service**:
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `PORT`: `3001` (optional, Railway assigns one automatically)
7. Click **"Deploy"**
8. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Deploy Client to Vercel

1. **Update client to use Railway URL**:

Create `client/.env.production`:
```
VITE_SOCKET_URL=https://your-app.up.railway.app
```

Replace `https://your-app.up.railway.app` with your actual Railway URL.

2. **Go to Vercel**: https://vercel.com/
3. **Sign up/Login** with GitHub
4. Click **"Add New Project"**
5. Import your `dice-roll` repository
6. **Configure the project**:
   - Framework Preset: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. **Add Environment Variable**:
   - Key: `VITE_SOCKET_URL`
   - Value: `https://your-app.up.railway.app` (your Railway URL)
8. Click **"Deploy"**

### Step 3: Update Server CORS

Update `server/src/server.ts` to allow your Vercel domain:

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-vercel-app.vercel.app', // Add your Vercel domain
    ],
    methods: ['GET', 'POST'],
  },
});
```

Push this change to GitHub, and Railway will auto-redeploy.

### Step 4: Test Your Deployment

1. Open your Vercel URL
2. Create a session
3. Open in another device/browser
4. Join the session
5. Test rolling dice

---

## Alternative: Deploy Everything on Railway

If you prefer to deploy both client and server on Railway:

1. **Deploy as monorepo**:
   - Create two Railway services from the same repo
   - Service 1: Server (root: `server`)
   - Service 2: Client (root: `client`)

2. **Configure Client Service**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -p $PORT`
   - Add `serve` to dependencies: `npm install serve --save`

3. **Add Environment Variable** to Client:
   - `VITE_SOCKET_URL`: Your server Railway URL

---

## GitHub Setup

### Step 1: Initialize Git (if not already done)

```bash
cd "c:\Users\ms-lu\AutoU\AutoU - Documentos\4. Iniciativas Internas\DadoVirtual"
git init
```

### Step 2: Add Remote Repository

```bash
git remote add origin git@github.com:appautou/dice-roll.git
```

### Step 3: Create .gitignore (already created)

Make sure `.gitignore` includes:
```
node_modules/
dist/
.env
.env.local
.env.production
```

### Step 4: Commit and Push

```bash
git add .
git commit -m "Initial commit: Virtual Dice app"
git branch -M main
git push -u origin main
```

---

## Post-Deployment Checklist

- [ ] Server is running and accessible
- [ ] Client can connect to server
- [ ] Can create sessions
- [ ] Can join sessions from different devices
- [ ] Dice rolls are synchronized
- [ ] Queue system works
- [ ] Host controls work
- [ ] Session IDs are copyable
- [ ] Mobile responsive design works

---

## Troubleshooting

### Client can't connect to server

1. Check `VITE_SOCKET_URL` is set correctly
2. Verify server CORS allows your client domain
3. Check server logs for errors
4. Ensure server is running (check Railway dashboard)

### "Transport unknown" errors

- This usually means Socket.io handshake failed
- Check that both client and server have matching Socket.io versions
- Verify the server URL is correct (must be full URL with https://)

### Vercel deployment fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vite.config.ts` has correct build settings

### Railway deployment fails

- Check build logs in Railway dashboard
- Ensure TypeScript compiles: `npm run build` locally
- Verify start script in `package.json`

---

## Environment Variables Summary

### Server (Railway)
- `PORT`: Auto-assigned by Railway (optional)

### Client (Vercel)
- `VITE_SOCKET_URL`: Your Railway server URL (e.g., `https://your-app.up.railway.app`)

---

## Costs

- **Railway**: Free tier includes $5/month credit (enough for this app)
- **Vercel**: Free tier includes unlimited personal projects
- **Total**: **FREE** for personal/internal use

---

**Need help? Check Railway and Vercel documentation or contact your dev team!**
