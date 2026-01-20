# Telegram Bot Deployment Guide for Railway

## Overview

The Telegram bot runs as a **separate service** from the main backend. This allows independent scaling and deployment.

## Files Structure

```
├── Dockerfile.telegram        # Docker config for bot
├── requirements-telegram.txt  # Minimal dependencies
├── railway.telegram.json      # Railway config
└── Backend/app/services/telegram_bot.py
```

## Deployment Steps

### 1. Create New Railway Service

In your Railway project:
1. Click "New Service" → "GitHub Repo"
2. Select your repository
3. **Important**: Go to Settings → Build → Set "Config Path" to `railway.telegram.json`

### 2. Configure Environment Variables

Add these variables in Railway service settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Same PostgreSQL URL as backend |
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `TELEGRAM_BOT_USERNAME` | Bot username without @ |
| `PRO_PLAN_PRICE_STARS` | Price in Stars (e.g., 100) |
| `SECRET_KEY` | Same as backend |

### 3. Deploy

Railway will automatically build and deploy using `Dockerfile.telegram`.

## Local Testing

```bash
# Run bot locally
uv run python -m Backend.app.services.telegram_bot
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│   (Vercel)      │     │   (Railway)     │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Railway)     │
                        └────────▲────────┘
                                 │
                        ┌────────┴────────┐
                        │  Telegram Bot   │
                        │   (Railway)     │
                        └─────────────────┘
```

Both Backend and Telegram Bot share the same database.
