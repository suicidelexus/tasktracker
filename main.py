from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import engine, Base
from backend.routers import router
from backend import models  # Импорт моделей для регистрации в Base
import os

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Tracker API")

# CORS middleware для доступа из локальной сети
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В локальной сети разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение API роутеров
app.include_router(router, prefix="/api")

# Раздача статических файлов frontend (после сборки React)
if os.path.exists("frontend/build"):
    app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Task Tracker API is running"}


