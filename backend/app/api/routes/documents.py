"""Document (PDF) upload and serve."""
import re
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.config import settings

router = APIRouter(prefix="/documents", tags=["documents"])

# Store uploads under backend (default: backend/uploads)
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / settings.upload_dir
ALLOWED_CONTENT = ("application/pdf",)
MAX_MB = 25

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _safe_filename(name: str) -> str:
    base = re.sub(r"[^\w\s.-]", "", name).strip() or "document"
    return base[:120]


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)) -> dict:
    """Accept a PDF upload; store and return URL for preview."""
    if file.content_type not in ALLOWED_CONTENT:
        raise HTTPException(400, "Only PDF files are allowed")
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_MB:
        raise HTTPException(400, f"File too large (max {MAX_MB} MB)")
    safe = _safe_filename(file.filename or "document.pdf")
    if not safe.lower().endswith(".pdf"):
        safe += ".pdf"
    fid = str(uuid.uuid4())
    stem = f"{fid}_{safe}"
    path = UPLOAD_DIR / stem
    path.write_bytes(content)
    # URL that frontend can use (proxied in dev)
    url = f"{settings.api_v1_prefix}/documents/files/{stem}"
    return {"id": fid, "filename": safe, "url": url}


@router.get("/files/{filename:path}")
def serve_file(filename: str):
    """Serve an uploaded PDF by filename."""
    base = UPLOAD_DIR.resolve()
    file_path = (base / filename).resolve()
    if not file_path.is_file() or base not in file_path.parents:
        raise HTTPException(404, "File not found")
    return FileResponse(file_path, media_type="application/pdf")
