from fastapi import FastAPI
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from backend.app.api.routes import router

app = FastAPI(
    title="Data Detective",
    description="Understand. Discover. Decide.",
    version="0.1.0" 
)

FRONTEND_DIR = Path(__file__).resolve().parents[2]/"frontend"

app.include_router(router=router, prefix="/api")

app.mount("/css", StaticFiles(directory=FRONTEND_DIR/"css"), name='css')
app.mount("/js", StaticFiles(directory=FRONTEND_DIR/"js"), name="js")
app.mount('/assets', StaticFiles(directory=FRONTEND_DIR/"assets"), name="assets")

@app.get("/", include_in_schema=False)
def homepage():     
    return FileResponse(FRONTEND_DIR/'index.html')