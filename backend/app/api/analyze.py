import pandas as pd 
from fastapi import APIRouter, UploadFile
from backend.app.engine.analysis_engine import analyze_dataset

analyzer_router = APIRouter()

@analyzer_router.post("/analyze")
async def analyze(file: UploadFile):
    df = pd.read_csv(file.file)
    return analyze_dataset(
        df=df,
        filename=file.filename
    )
    
    
    

