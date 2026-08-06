import pandas as pd 
from fastapi import APIRouter, UploadFile
from backend.app.analyzers.overview_analyzer import analyze_overview

analyzer_router = APIRouter()

@analyzer_router.post("/analyze")
async def analyze(file: UploadFile):
    df = pd.read_csv(file.file)
    overview = analyze_overview(df)
    return{
        "filename":file.filename,
        **overview
    }
    
    
    

