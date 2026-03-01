# MCQ Mining

Production-style FastAPI + React stack. One-page app with a simple "hello" API. Database can be added later.

## Stack

- **Backend:** FastAPI, uvicorn, pydantic-settings
- **Frontend:** React 18, Vite, TypeScript

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs  
Health: http://127.0.0.1:8000/health  
Hello: http://127.0.0.1:8000/api/v1/hello

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 — single page that calls the API and shows the hello message.

### Optional env

- **Backend:** copy `backend/.env.example` to `backend/.env` to set `DEBUG`, `API_V1_PREFIX`, etc.
- **Frontend:** set `VITE_API_URL` to the full API base URL if not using the dev proxy (e.g. `http://127.0.0.1:8000/api/v1`).

## Project layout

```
backend/
  app/
    main.py          # FastAPI app, CORS, lifespan
    config.py        # Settings (env)
    api/routes/      # API routes (hello)
  requirements.txt
frontend/
  src/
    App.tsx          # Single page, fetches /api/v1/hello
    main.tsx
    index.css
  vite.config.ts     # Proxy /api -> backend
```

Expand from here; add database and more routes when ready.
# mcq_minning
# mcq_minning
