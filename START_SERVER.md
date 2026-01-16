# 🚀 HOW TO START THE SERVER

## ⚠️ CRITICAL: Your Terminal is Cached in Trash

Your terminal is still pointing to `/Users/nurma/.Trash/Backend` (deleted files).

## ✅ STEP-BY-STEP FIX

### 1. Close Your Terminal Completely
- **DO NOT just press Ctrl+C**
- Close the entire terminal tab/window where you see "Backend %" prompt

### 2. Open a NEW Terminal
- Open a fresh terminal window/tab in VS Code or iTerm

### 3. Navigate to Project Root
```bash
cd /Users/nurma/vscode_projects/RAG_Test
```

### 4. Activate Virtual Environment (Optional but Recommended)
```bash
source .venv/bin/activate
```

### 5. Start the Server
```bash
# Option 1: Using uv (recommended)
uv run uvicorn main:app --reload

# Option 2: Direct execution
.venv/bin/uvicorn main:app --reload
```

### 6. Verify Success
You should see:
```
INFO: Will watch for changes in these directories: ['/Users/nurma/vscode_projects/RAG_Test']
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Started reloader process [XXXXX] using StatReload
INFO: Started server process [XXXXX]
INFO: Waiting for application startup.
INFO: Backend.app.main: Initializing RAG Service...
INFO: Backend.app.services.rag_service: Connected to Qdrant...
```

## ❌ WRONG - Do NOT Do This
```bash
cd Backend  # ❌ WRONG
uvicorn main:app --reload  # ❌ WRONG - loads from Trash!
```

## ✅ CORRECT - Do This
```bash
cd /Users/nurma/vscode_projects/RAG_Test  # ✅ CORRECT
uv run uvicorn main:app --reload  # ✅ CORRECT
```

## 🔍 How to Verify You're in the Right Directory
```bash
pwd
# Should output: /Users/nurma/vscode_projects/RAG_Test

ls
# Should see: Backend  Frontend  main.py  pyproject.toml  .env
```

## 🐛 Still Having Issues?

### Issue: "Will watch for changes in /Users/nurma/.Trash/Backend"
**Solution:** Your terminal is STILL cached. You MUST close and reopen terminal.

### Issue: "No module named 'qdrant_client'"
**Solution:** Run `uv sync` from project root first.

### Issue: "supabase_url is required"
**Solution:** You're loading old code from Trash. Close terminal and start fresh.
