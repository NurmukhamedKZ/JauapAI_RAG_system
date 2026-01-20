# Deployment Guide: JauapAI

This guide outlines the steps to deploy the **Backend** to [Railway](https://railway.app/) and the **Frontend** to [Vercel](https://vercel.com/).

## Prerequisites
- A **GitHub** account with the project repository pushed.
- A **Railway** account.
- A **Vercel** account.

---

## Part 1: Deploy Backend to Railway

Railway is excellent for Python FastApi applications and provides a built-in PostgreSQL database.

### 1. Create Project
1.  Log in to [Railway](https://railway.app/).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your `JauapAI` repository.
4.  Click **"Deploy Now"**.

### 2. Configure Service (Settings)
Once the project is created, click on the repository card to open the settings.

1.  Go to the **Settings** tab.
2.  Scroll down to **Build & Deploy**.
3.  **Root Directory**: Leave as `/` (default).
4.  **Build Command**: Railway usually detects `requirements.txt` automatically. If not, set it to:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Start Command**: You **MUST** set this manually to point to the correct app location:
    ```bash
    uvicorn Backend.app.main:app --host 0.0.0.0 --port $PORT
    ```

### 3. Set Environment Variables
Go to the **Variables** tab. Add the following variables. (Copy values from your local `.env`).

| Variable | Value / Notes |
| :--- | :--- |
| `PORT` | `3000` (or leave default, Railway sets this automatically) |
| `DATABASE_URL` | *See step 4 below* |
| `SECRET_KEY` | Copy from local `.env` or generate a new secure one. |
| `GEMINI_API_KEY` | Copy from local `.env`. |
| `OPENAI_API_KEY` | Copy from local `.env` (if used). |
| `QDRANT_API` | Copy from local `.env`. |
| `QDRANT_URL` | Copy from local `.env`. |
| `VOYAGE_API` | Copy from local `.env`. |
| `COLLECTION_NAME` | `JauapAI_2` (or your preferred name). |
| `CORS_ORIGINS` | `*` (Initially allows all connections. We will update this later). |
| `FRONTEND_URL` | The URL of your Vercel site (we will get this in Part 2). |
| `GOOGLE_CLIENT_ID` | Copy from local `.env`. |
| `GOOGLE_CLIENT_SECRET`| Copy from local `.env`. |
| `GOOGLE_REDIRECT_URI` | Update to your production URL: `https://<YOUR-VERCEL-DOMAIN>/auth/callback` |
| `TELEGRAM_BOT_TOKEN` | Copy from local `.env`. |
| `RESEND_API_KEY` | Copy from local `.env`. |

### 4. Database Setup
1.  In the Railway project view, click **"New"** -> **"Database"** -> **"PostgreSQL"**.
2.  Railway will create a Postgres service.
3.  Once created, it automatically adds a `DATABASE_URL` variable to your Backend service. You can verify this in the Variables tab.

### 5. Generate Domain
1.  Go to the **Settings** tab of your Backend service.
2.  Under **Networking**, click **"Generate Domain"**.
3.  Copy this URL (e.g., `https://jauap-production.up.railway.app`). You will need it for the frontend.

---

## Part 2: Deploy Frontend to Vercel

### 1. Import Project
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `JauapAI` repository.

### 2. Configure Build Settings
Vercel needs to know the frontend is in a subdirectory.

1.  **Framework Preset**: Select **Vite**.
2.  **Root Directory**: Click "Edit" and select `Frontend`.
3.  **Build Command**: Leave default (`vite build` or `npm run build`).
4.  **Output Directory**: Leave default (`dist`).
5.  **Install Command**: Leave default (`npm install`).

### 3. Environment Variables
Expand the **Environment Variables** section.

1.  Add `VITE_API_URL`.
2.  **Value**: The Railway Backend URL from Part 1, appended with `/api`.
    *   Example: `https://jauap-production.up.railway.app/api`
    *   *Note: Ensure you include the `/api` path at the end.*

### 4. Deploy
Click **"Deploy"**. Vercel will build and launch your site.

---

## Part 3: Final Connection & Security

Now that both are deployed, secure the connection.

1.  **Get Vercel Domain**: Copy your new frontend domain (e.g., `https://jauapai.vercel.app`).
2.  **Update Railway Config**:
    *   Go back to Railway -> Variables.
    *   Update `CORS_ORIGINS`: Change `*` to your Vercel domain (e.g., `https://jauapai.vercel.app`).
    *   Update `FRONTEND_URL`: Set to `https://jauapai.vercel.app`.
    *   Update `GOOGLE_REDIRECT_URI`: Set to `https://jauapai.vercel.app/auth/callback`.
3.  **Redeploy Backend**: Railway usually redeploys automatically on variable changes. If not, click **"Redeploy"**.
4.  **Update Google Cloud Console**:
    *   Go to your [Google Cloud Console](https://console.cloud.google.com/).
    *   Add your Vercel domain to **Authorized JavaScript origins**.
    *   Add `https://jauapai.vercel.app/auth/callback` to **Authorized redirect URIs**.

## Troubleshooting
- **404 on API calls?** Check if `VITE_API_URL` has the `/api` suffix.
- **CORS Errors?** Ensure `CORS_ORIGINS` in Railway exactly matches your Vercel domain.
- **Build Fails?** Check the logs. If Python fails on version, add a `runtime.txt` file with `python-3.11` to the root.
