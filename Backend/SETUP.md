# Quick Setup Guide

## 🚀 Getting Started with Supabase

### Step 1: Create Supabase Project
1. Visit [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Set project name, database password, region
4. Wait ~2 minutes for project to initialize

### Step 2: Get Your Credentials
In your Supabase Dashboard:

**For SUPABASE_URL and SUPABASE_KEY:**
- Settings → API
- Copy "Project URL" → This is your `SUPABASE_URL`
- Copy "anon public" key → This is your `SUPABASE_KEY`

**For DATABASE_URL:**
- Settings → Database → Connection string → URI
- Copy and replace `[YOUR-PASSWORD]` with your database password
- This is your `DATABASE_URL`

### Step 3: Update .env
Open `/Users/nurma/vscode_projects/RAG_Test/.env` and replace:
```env
SUPABASE_URL=your-project-url-here
SUPABASE_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
```

### Step 4: Enable Google OAuth (Optional)
In Supabase Dashboard:
- Authentication → Providers → Google
- Enable Google provider
- Add your Google OAuth credentials from Google Cloud Console

### Step 5: Run Migrations
```bash
cd /Users/nurma/vscode_projects/RAG_Test/Backend
../.venv/bin/alembic revision --autogenerate -m "Initial schema"
../.venv/bin/alembic upgrade head
```

### Step 6: Start the Server
```bash
cd /Users/nurma/vscode_projects/RAG_Test
.venv/bin/uvicorn Backend.main:app --reload
```

Visit http://localhost:8000/docs to see your API!

## ✅ Verification
Test your setup:
1. Open http://localhost:8000/docs
2. Try POST /auth/register with test credentials
3. Check Supabase Dashboard → Authentication to see the user
4. Check Table Editor → users table to see the synced record
