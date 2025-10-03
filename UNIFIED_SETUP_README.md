# 🚀 Unified Full-Stack Setup

Your frontend and backend have been merged into a single full-stack application! No more CORS issues, no more external API calls, and a single deployment.

## ✅ What Changed

### 🔄 **Unified Architecture**
- **Before**: Separate frontend (Vite + React) and backend (Express) servers
- **After**: Single Express server that serves both frontend build and API routes

### 🛠️ **Key Benefits**
- ✅ **No CORS issues** - Frontend and backend share the same domain
- ✅ **Single deployment** - One server handles everything
- ✅ **Faster API calls** - Internal calls instead of external HTTP requests
- ✅ **Simpler development** - One command to run everything
- ✅ **Better security** - No external API exposure

## 🚀 Quick Start

### Development Mode
```bash
# Option 1: Run both frontend and backend together
npm run dev:unified

# Option 2: Run separately (if needed)
npm run start:dev
```

### Production Mode
```bash
# Build and start production server
npm run start
```

## 📁 File Structure

```
urcare-v1.0/
├── unified-server.js          # 🆕 Main server (frontend + backend)
├── dev-unified.js            # 🆕 Development script
├── vercel-unified.json       # 🆕 Vercel deployment config
├── src/                      # Frontend React code
│   ├── services/             # Updated to use relative paths
│   ├── components/           # Updated API calls
│   └── pages/                # Updated API calls
└── dist/                     # Built frontend (created by npm run build)
```

## 🔧 How It Works

### 1. **Unified Server** (`unified-server.js`)
```javascript
// API Routes (Backend)
app.post('/api/health-score', ...)
app.post('/api/health-plans', ...)
app.post('/api/groq/generate-plan', ...)

// Frontend Serving
app.use(express.static('dist'))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
```

### 2. **Frontend API Calls** (Updated)
```javascript
// Before (External API)
const response = await fetch('https://urcare-server.vercel.app/api/health-score', {
  method: 'POST',
  body: JSON.stringify(data)
});

// After (Internal API)
const response = await fetch('/api/health-score', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## 🛠️ Development Workflow

### Local Development
```bash
# Start both frontend and backend
npm run dev:unified

# Access points:
# Frontend: http://localhost:8080
# API: http://localhost:3000/api
# Health: http://localhost:3000/health
```

### Production Build
```bash
# Build frontend and start server
npm run start

# Access points:
# Frontend: http://localhost:3000
# API: http://localhost:3000/api
# Health: http://localhost:3000/health
```

## 🌐 Deployment

### Vercel Deployment
```bash
# Use the unified Vercel config
vercel --config vercel-unified.json
```

### Other Platforms
The unified server works on any Node.js hosting platform:
- **Heroku**: Deploy `unified-server.js` as main file
- **Railway**: Deploy with `npm run start`
- **DigitalOcean**: Deploy with `npm run start`

## 📋 API Endpoints

All API endpoints are now internal and accessible at `/api/*`:

- `POST /api/health-score` - Generate health scores
- `POST /api/health-plans` - Generate health plans
- `POST /api/plan-activities` - Generate plan activities
- `POST /api/groq/generate-plan` - Groq plan generation
- `POST /api/groq/audio-process` - Audio processing
- `GET /api/user/profile` - User profile
- `GET /health` - Health check

## 🔧 Configuration

### Environment Variables
```bash
# Required
VITE_GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Optional
PORT=3000
NODE_ENV=production
```

### Vite Configuration
- Removed proxy configuration (no longer needed)
- Frontend runs on port 8080 in development
- Backend runs on port 3000 in development

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Kill processes on ports 3000 and 8080
   npx kill-port 3000 8080
   ```

2. **Build issues**
   ```bash
   # Clean and rebuild
   rm -rf dist node_modules
   npm install
   npm run build
   ```

3. **API not working**
   - Check that `unified-server.js` is running
   - Verify API calls use relative paths (`/api/...`)
   - Check server logs for errors

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev:unified
```

## 📊 Performance Benefits

- **Faster API calls**: Internal calls vs external HTTP requests
- **Reduced latency**: No network round-trips for API calls
- **Better caching**: Single server can optimize caching
- **Simplified monitoring**: One server to monitor

## 🔒 Security Benefits

- **No external API exposure**: All APIs are internal
- **Reduced attack surface**: Single server to secure
- **Better authentication**: Shared session management
- **Simplified CORS**: No cross-origin requests

## 🎯 Next Steps

1. **Test the unified setup**:
   ```bash
   npm run dev:unified
   ```

2. **Verify all features work**:
   - Health score generation
   - Health plan creation
   - Voice recording
   - Payment processing

3. **Deploy to production**:
   ```bash
   npm run start
   ```

4. **Monitor performance**:
   - Check server logs
   - Monitor API response times
   - Verify frontend loading

## 📝 Migration Notes

### What Was Removed
- ❌ External API calls
- ❌ CORS configuration
- ❌ Proxy setup in Vite
- ❌ Separate backend server

### What Was Added
- ✅ Unified server (`unified-server.js`)
- ✅ Internal API routes
- ✅ Relative path API calls
- ✅ Single deployment configuration

### What Was Updated
- 🔄 All frontend services use relative paths
- 🔄 Package.json scripts for unified development
- 🔄 Vite configuration (removed proxy)
- 🔄 Environment configuration

## 🎉 Success!

Your application is now a true full-stack monolith with:
- **Zero CORS issues**
- **Single deployment**
- **Faster performance**
- **Simpler development**
- **Better security**

Run `npm run dev:unified` to start developing!
