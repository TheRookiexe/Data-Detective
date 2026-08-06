from fastapi import APIRouter
from backend.app.api.health import health_router
from backend.app.api.analyze import analyzer_router

router = APIRouter()

router.include_router(router=health_router)
router.include_router(router=analyzer_router)   

