# 🎯 Frontend-Backend Connection Guide

## ✅ Already Connected!

The frontend and backend are **already integrated**. Here's what was done:

### Architecture Overview

```
USER → Frontend (Supabase Auth) → Get JWT Token → Backend (Verify JWT) → RAG Service → Response
```

## 🔐 Authentication Flow

### Client-Side (Frontend)
- Uses **Supabase JavaScript Client**
- Handles login/register/OAuth directly with Supabase
- Stores JWT tokens automatically
- No backend auth endpoints needed

### Server-Side (Backend)
- Verifies JWT tokens from Supabase
- Protected endpoint: `POST /api/chat`
- Requires `Authorization: Bearer <token>` header

## 📡 API Endpoints

### Backend Endpoints
- ✅ `GET /health` - Health check (no auth)
- ✅ `POST /api/chat` - Chat endpoint (requires auth)

### ❌ NOT Implemented
- `/auth/login` - Not needed (Supabase handles this)
- `/auth/register` - Not needed (Supabase handles this)
- `/auth/google` - Not needed (Supabase handles OAuth)

## 🧪 How to Test Chat

### Option 1: Frontend UI (Recommended)
1. Make sure backend is running:
   ```bash
   cd /Users/nurma/vscode_projects/RAG_Test
   uv run uvicorn main:app --reload
   ```

2. Make sure frontend is running:
   ```bash
   cd /Users/nurma/vscode_projects/RAG_Test/Frontend
   npm run dev
   ```

3. Open browser to frontend URL (e.g., `http://localhost:5173`)

4. **Register/Login** via Supabase:
   - Go to `/register` or `/login`
   - Create account or sign in
   - Supabase will handle everything

5. **Navigate to Chat**:
   - After login, go to chat page
   - Type a message
   - Should see streaming response!

### Option 2: Manual cURL Test
To test chat without frontend, you need a real Supabase JWT token:

1. Login via frontend first
2. Open browser DevTools → Application → Local Storage
3. Copy the `sb-<project>-auth-token` value
4. Extract the `access_token` from the JSON
5. Use it in curl:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message": "Тест", "filters": {"grade": "6 сынып"}}'
```

## 🔍 Troubleshooting

### Backend Running?
```bash
# Check if backend is up
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

### Frontend Running?
Check `http://localhost:5173` (or whatever port npm dev shows)

### 404 Errors for /auth/* ?
**This is NORMAL!** We use Supabase client-side auth, not backend endpoints.

### Chat Not Working?
1. Open browser console (F12)
2. Check for errors
3. Verify:
   - User is logged in
   - JWT token is being sent in requests
   - Backend is reachable at `http://localhost:8000/api`

### CORS Issues?
Backend is configured to allow all origins for development. Should work fine.

## 📊 Expected Flow

1. **User Opens Frontend** → Supabase checks for existing session
2. **User Logs In** → Supabase authenticates → Returns JWT
3. **User Sends Chat Message** → Frontend gets JWT from Supabase → Sends to backend
4. **Backend Receives Request** → Verifies JWT → Runs RAG → Streams response
5. **Frontend Displays Response** → Real-time streaming updates

## ✨ What's Working

- ✅ Backend RAG service initialized
- ✅ Backend chat endpoint protected with Supabase JWT verification
- ✅ Frontend Supabase client setup
- ✅ Frontend auth services (login/register/OAuth)
- ✅ Frontend chat service with streaming
- ✅ UI integration complete

## 🎯 Next Steps

1. **Test the full flow**:
   - Register → Login → Chat
   
2. **Add features**:
   - Grade/discipline filters in UI
   - Chat history
   - Conversation management

3. **Production deployment**:
   - Update CORS settings
   - Use production Supabase keys
   - Deploy backend and frontend
