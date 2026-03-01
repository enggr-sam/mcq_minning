"""Hello API routes."""
from fastapi import APIRouter

router = APIRouter(prefix="/hello", tags=["hello"])


@router.get("")
def hello() -> dict[str, str]:
    """Return a greeting. Database will be added later."""
    return {"message": "Hello! Welcome to MCQ Mining."}
