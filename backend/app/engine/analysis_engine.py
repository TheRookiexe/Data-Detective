from backend.app.analyzers.overview_analyzer import analyze_overview
from backend.app.analyzers.quality_analyzer import analyze_quality

def analyze_dataset(df, filename):
    overview = analyze_overview(df)
    quality = analyze_quality(df)
    return{
        "overview": {
            "filename": filename,
            **overview
        },
        "quality": {
            **quality
        }
    }