# Task Tracker

Веб-приложение для управления задачами с поддержкой Rice Scoring и Матрицы Эйзенхауэра.

## Возможности

- 📝 Создание и управление задачами
- 📊 Rice Scoring для приоритизации задач
- 🎯 Матрица Эйзенхауэра для планирования
- 📁 Группировка задач по проектам
- 🔗 Ссылки на внешние трекеры (YouTrack, Jira и др.)
- 👥 Назначение исполнителей

## Установка и запуск

### Бэкенд (FastAPI)

1. Установите зависимости Python:
```bash
cd C:\Users\suici\PycharmProjects\tasktracker
python -m pip install -r requirements.txt
```

2. Запустите сервер:
```bash
python main.py
```

Сервер запустится на `http://0.0.0.0:8000` (доступен из локальной сети)

### Фронтенд (React)

1. Установите зависимости Node.js:
```bash
cd frontend
npm install
```

2. Запустите в режиме разработки:
```bash
npm start
```

Приложение откроется на `http://localhost:3000`

3. Для production сборки:
```bash
npm run build
```

После сборки файлы будут в папке `frontend/build` и будут автоматически доступны через FastAPI.

## Доступ из локальной сети

1. Запустите бэкенд командой `python main.py`
2. Узнайте свой локальный IP адрес:
   - Windows: `ipconfig` (ищите IPv4 адрес, например 192.168.1.100)
   - Linux/Mac: `ifconfig` или `ip addr`
3. Другие устройства в сети могут подключиться по адресу:
   - Бэкенд API: `http://ваш-ip:8000`
   - Фронтенд (после npm build): `http://ваш-ip:8000`

## API Документация

После запуска бэкенда документация API доступна по адресу:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Технологии

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

**Frontend:**
- React 18
- React Router
- Axios
- Lucide Icons

## Структура проекта

```
tasktracker/
├── backend/           # Бэкенд FastAPI
│   ├── crud.py       # CRUD операции
│   ├── database.py   # Настройки БД
│   ├── models.py     # SQLAlchemy модели
│   ├── routers.py    # API endpoints
│   └── schemas.py    # Pydantic схемы
├── frontend/         # Фронтенд React
│   ├── public/
│   └── src/
│       ├── components/  # React компоненты
│       ├── pages/       # Страницы
│       └── services/    # API клиент
├── main.py           # Главный файл запуска
└── requirements.txt  # Python зависимости
```

## Rice Scoring

**Формула:** Priority Score = Value × Reach × Budget Impact × Confidence

- **Value (1-5)** — влияние фичи
- **Reach (1-5)** — охват пользователей
- **Budget Impact (1, 1.2, 1.5, 2)** — влияние на бюджет
- **Confidence (10-100%)** — уверенность в оценке

**Интерпретация:**
- 40+ — Берём в работу
- 25-39 — Кандидат в работу
- 10-24 — Требуется уточнение
- 0-9 — Не берём в работу

## Матрица Эйзенхауэра

Задачи распределяются по 4 квадрантам:
1. **Важно и срочно** — делать немедленно
2. **Важно, не срочно** — планировать
3. **Не важно, срочно** — делегировать
4. **Не важно, не срочно** — удалить или отложить

