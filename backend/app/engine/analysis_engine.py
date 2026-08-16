from backend.app.analyzers.overview_analyzer import analyze_overview
from backend.app.analyzers.quality_analyzer import analyze_quality
from backend.app.analyzers.findings_analyzer import analyze_findings
from backend.app.analyzers.recommendation_analyzer import analyze_recommendations
from backend.app.analyzers.visualization_analyzer import analyze_visualizations

def analyze_dataset(df, filename):
    overview = analyze_overview(df)
    quality = analyze_quality(df)
    findings = analyze_findings(overview, quality)
    recommendations = analyze_recommendations(overview, quality, findings)
    visualizations = analyze_visualizations(df, overview, quality, findings)
    return{
        "overview": {
            "filename": filename,
            **overview
        },
        "quality": {
            **quality
        },
        "findings": {
            **findings
        },
        "recommendations": {
            **recommendations
        },
        "visualizations":{
            **visualizations
        }
    }