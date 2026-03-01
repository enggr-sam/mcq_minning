import { useCallback, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

interface UploadResponse {
  id: string
  filename: string
  url: string
}

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const clearPreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setUploadUrl(null)
    setFile(null)
    setUploadError(null)
  }, [previewUrl])

  const handleFile = useCallback(
    async (selected: File | null) => {
      if (!selected) {
        clearPreview()
        return
      }
      if (selected.type !== 'application/pdf') {
        setUploadError('Please select a PDF file.')
        return
      }
      const prev = previewUrl
      if (prev) URL.revokeObjectURL(prev)
      setFile(selected)
      setPreviewUrl(null)
      setUploadUrl(null)
      setUploadError(null)
      const blob = URL.createObjectURL(selected)
      setPreviewUrl(blob)
      setUploading(true)
      try {
        const form = new FormData()
        form.append('file', selected)
        const res = await fetch(`${API_BASE}/documents/upload`, {
          method: 'POST',
          body: form,
        })
        if (!res.ok) {
          const err = await res.text()
          throw new Error(err || `Upload failed: ${res.status}`)
        }
        const data = (await res.json()) as UploadResponse
        setUploadUrl(data.url)
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [previewUrl, clearPreview]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0] ?? null)
      e.target.value = ''
    },
    [handleFile]
  )

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">MCQ Mining</h1>
        <p className="tagline">Upload a PDF to preview. Ready for AI processing later.</p>
      </header>

      <section className="upload-section">
        <div
          className={`dropzone ${dragOver ? 'dropzone--active' : ''} ${previewUrl ? 'dropzone--has-file' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            type="file"
            accept="application/pdf"
            className="dropzone-input"
            onChange={onInputChange}
            aria-label="Choose PDF file"
          />
          {!previewUrl ? (
            <>
              <div className="dropzone-icon" aria-hidden>
                <PdfIcon />
              </div>
              <p className="dropzone-text">Drag & drop your PDF here, or click to browse</p>
              <p className="dropzone-hint">Max 25 MB. PDF only.</p>
            </>
          ) : (
            <>
              <div className="dropzone-icon dropzone-icon--small" aria-hidden>
                <PdfIcon />
              </div>
              <p className="dropzone-filename">{file?.name}</p>
              {uploading && <p className="dropzone-status">Uploading…</p>}
              {uploadError && <p className="dropzone-error">{uploadError}</p>}
              {!uploading && !uploadError && uploadUrl && (
                <p className="dropzone-status dropzone-status--ok">Saved. Preview below.</p>
              )}
              <button type="button" className="btn btn--secondary" onClick={clearPreview}>
                Choose another file
              </button>
            </>
          )}
        </div>
      </section>

      {previewUrl && (
        <section className="preview-section">
          <div className="preview-header">
            <h2 className="preview-title">Preview</h2>
            <span className="preview-badge">PDF</span>
          </div>
          <div className="preview-frame-wrap">
            <iframe
              title="PDF preview"
              src={previewUrl}
              className="preview-frame"
            />
          </div>
        </section>
      )}

      <footer className="footer">
        <p>One page. Upload and preview. Database and AI features coming later.</p>
      </footer>
    </div>
  )
}

function PdfIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </svg>
  )
}
