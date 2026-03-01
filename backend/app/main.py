"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import hello


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown hooks. Add DB connection here later."""
    yield
    # Teardown if needed


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hello.router, prefix=settings.api_v1_prefix)


@app.get("/health")
def health() -> dict[str, str]:
    """Health check for load balancers and monitoring."""
    return {"status": "ok"}
