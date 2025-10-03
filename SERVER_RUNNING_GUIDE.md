# UrCare Unified Server - Continuous Running Guide

## 🚀 Server Status
✅ **UNIFIED SERVER IS RUNNING CONTINUOUSLY**

The server is now running on `http://localhost:3000` and will continue running until manually stopped.

## 📋 Available Commands

### Start Server (Multiple Options)
```bash
# Option 1: Using npm script
npm run serve

# Option 2: Using npm script (forever)
npm run serve:forever

# Option 3: Direct node command
node unified-server.js

# Option 4: Using batch file (Windows)
start-server.bat

# Option 5: Using shell script (Linux/Mac)
chmod +x start-server.sh
./start-server.sh
```

### Build and Start (Production)
```bash
# Build frontend and start server
npm run start

# Build for development and start
npm run build:dev && npm run serve
```

## 🌐 Server Endpoints

### Frontend
- **Main App**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### API Endpoints
- **Health Score**: http://localhost:3000/api/health-score
- **Health Plans**: http://localhost:3000/api/health-plans
- **Plan Activities**: http://localhost:3000/api/plan-activities
- **Groq Generate Plan**: http://localhost:3000/api/groq/generate-plan
- **Audio Process**: http://localhost:3000/api/groq/audio-process
- **User Profile**: http://localhost:3000/api/user/profile

## 🔧 Server Features

### ✅ What's Working
- ✅ Express server running continuously
- ✅ Frontend React app served from `/dist`
- ✅ All API routes working internally (no CORS issues)
- ✅ Groq AI integration configured
- ✅ Supabase integration configured
- ✅ Health check endpoint
- ✅ Request logging
- ✅ Error handling

### 🛠️ Server Configuration
- **Port**: 3000 (configurable via PORT env var)
- **CORS**: Configured for localhost development
- **Static Files**: Served from `dist/` folder
- **API Routes**: All backend logic integrated
- **Error Handling**: Comprehensive error responses

## 🚨 Troubleshooting

### Server Won't Start
1. Check if port 3000 is already in use:
   ```bash
   netstat -an | findstr :3000
   ```

2. Kill any existing processes:
   ```bash
   # Windows
   taskkill /f /im node.exe
   
   # Linux/Mac
   pkill -f node
   ```

3. Restart the server:
   ```bash
   npm run serve
   ```

### Frontend Not Loading
1. Make sure the frontend is built:
   ```bash
   npm run build
   ```

2. Check if `dist/` folder exists and has `index.html`

### API Calls Failing
1. Check server logs for errors
2. Verify the server is running on port 3000
3. Test API endpoints directly:
   ```bash
   curl http://localhost:3000/api/health-score
   ```

## 📊 Server Monitoring

### Check Server Status
```bash
# Check if server is listening
netstat -an | findstr :3000

# Test health endpoint
curl http://localhost:3000/health

# Test API endpoint
curl http://localhost:3000/api/health-score
```

### View Server Logs
The server logs all requests and errors to the console. Look for:
- `🚀 Unified server running on port 3000`
- `[timestamp] GET/POST /path` - Request logs
- `❌ Error messages` - Error logs

## 🔄 Restart Server

### Graceful Restart
1. Press `Ctrl+C` in the terminal running the server
2. Run `npm run serve` again

### Force Restart
1. Kill all Node processes: `taskkill /f /im node.exe` (Windows) or `pkill -f node` (Linux/Mac)
2. Start server: `npm run serve`

## 🌍 Production Deployment

For production deployment, the server is configured to:
- Serve the built React app
- Handle all API routes internally
- Use environment variables for configuration
- Include proper error handling and logging

The unified server eliminates CORS issues and provides a single deployment target for both frontend and backend.

---

**Server is currently running and ready for use! 🎉**
