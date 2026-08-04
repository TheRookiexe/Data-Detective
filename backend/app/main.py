from fastapi import FastAPI

app = FastAPI(
    title="Data Detective",
    description="Understand. Discover. Decide.",
    version="0.1.0" 
)

@app.get("/")
def root():
    return{
        "project": "Data Detective",
        "message": "Understand. Discover. Decide."
    }