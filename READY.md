# ✅ ПРОЕКТ ГОТОВ К ЗАПУСКУ!

## 📦 Что установлено

### Backend (Python/FastAPI)
✅ FastAPI 0.135.1
✅ Uvicorn 0.41.0  
✅ SQLAlchemy 2.0.46
✅ Pydantic 2.12.5
✅ База данных SQLite (tasktracker.db) создана

### Frontend (React)
✅ React 18.2.0
✅ React Router 6.20.0
✅ Axios 1.6.2
✅ Lucide Icons 0.294.0
✅ Все npm пакеты установлены (1303 packages)

## 🚀 Как запустить проект

### Вариант 1: Использование bat-файлов (РЕКОМЕНДУЕТСЯ)

1. **Запуск Backend:**
   - Двойной клик на `start_backend.bat`
   - Сервер запустится на http://0.0.0.0:8080
   - API будет доступен по адресу http://localhost:8080/api

2. **Запуск Frontend:**
   - Двойной клик на `start_frontend.bat`
   - React приложение откроется в браузере на http://localhost:3000

### Вариант 2: Ручной запуск из терминала

#### Backend:
```powershell
cd C:\Users\suici\PycharmProjects\tasktracker
py main.py
```

#### Frontend:
```powershell
cd C:\Users\suici\PycharmProjects\tasktracker\frontend
npm start
```

## 🌐 Доступ из локальной сети

1. Узнайте ваш IP адрес:
   ```powershell
   ipconfig
   ```
   Ищите строку "IPv4-адрес" (например, 192.168.1.100)

2. Запустите backend (он уже настроен на 0.0.0.0)

3. Другие устройства в сети могут открыть:
   - Frontend (после npm build): `http://ваш-ip:8080`
   - API напрямую: `http://ваш-ip:8080/api`

## 📝 Важные URL

После запуска доступны:

- **Frontend (dev):** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **API Документация (Swagger):** http://localhost:8080/docs
- **API Документация (ReDoc):** http://localhost:8080/redoc
- **Health Check:** http://localhost:8080/api/health

## 🎨 Возможности приложения

✅ **Управление задачами**
   - Создание, редактирование, удаление задач
   - Построчный вид задач в таблице
   - Фильтрация по группам
   - Назначение исполнителей
   - Ссылки на внешние трекеры

✅ **Группировка проектов**
   - Создание групп для разных проектов
   - Фильтрация задач по группам

✅ **Rice Scoring** (Analytics)
   - Value (1-5) — влияние фичи
   - Reach (1-5) — охват пользователей
   - Budget Impact (1, 1.2, 1.5, 2) — влияние на бюджет
   - Confidence (10-100%) — уверенность
   - Автоматический расчет Priority Score
   - Категоризация задач по приоритету

✅ **Матрица Эйзенхауэра** (Analytics)
   - 4 квадранта: Важно/Срочно
   - Визуализация в виде сетки
   - Автоматическая классификация задач

✅ **Боковое меню**
   - Сворачивается в компактный вид
   - Разделы: Основное и Аналитика
   - React Router для навигации

## 🔧 Структура проекта

```
tasktracker/
├── backend/
│   ├── __init__.py
│   ├── crud.py          # CRUD операции для БД
│   ├── database.py      # Настройка SQLAlchemy
│   ├── models.py        # Модели БД (Task, TaskGroup)
│   ├── routers.py       # API endpoints
│   └── schemas.py       # Pydantic схемы валидации
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js      # Боковое меню
│   │   │   └── TaskModal.js    # Модальное окно задачи
│   │   ├── pages/
│   │   │   ├── AllTasks.js           # Страница всех задач
│   │   │   ├── RiceScoring.js        # Страница Rice Scoring
│   │   │   └── EisenhowerMatrix.js   # Матрица Эйзенхауэра
│   │   ├── services/
│   │   │   └── api.js           # API клиент (Axios)
│   │   ├── App.js               # Главный компонент
│   │   ├── index.js             # Точка входа
│   │   └── index.css            # Все стили
│   ├── .env                     # Конфигурация (API URL)
│   └── package.json
├── main.py                      # Точка входа FastAPI
├── requirements.txt             # Python зависимости
├── tasktracker.db              # SQLite база данных
├── start_backend.bat           # Запуск бэкенда (Windows)
├── start_frontend.bat          # Запуск фронтенда (Windows)
└── README.md                   # Документация

```

## 🐛 Возможные проблемы

### Порт 8080 занят
Если видите ошибку "address already in use":
```powershell
# Найти процесс на порту 8080
netstat -ano | findstr :8080

# Остановить процесс (замените PID на ID процесса)
Stop-Process -Id PID -Force
```

### Node.js не найден
Закройте и откройте PowerShell заново после установки Node.js

### Python не найден
Используйте `py` вместо `python` в командах

## 📊 API Endpoints

### Tasks
- `GET /api/tasks/` - Получить все задачи
- `POST /api/tasks/` - Создать задачу
- `GET /api/tasks/{id}` - Получить задачу
- `PUT /api/tasks/{id}` - Обновить задачу
- `DELETE /api/tasks/{id}` - Удалить задачу

### Groups
- `GET /api/groups/` - Получить все группы
- `POST /api/groups/` - Создать группу
- `GET /api/groups/{id}` - Получить группу
- `PUT /api/groups/{id}` - Обновить группу
- `DELETE /api/groups/{id}` - Удалить группу

### Analytics
- `GET /api/analytics/rice` - Задачи с Rice Score
- `GET /api/analytics/eisenhower` - Матрица Эйзенхауэра

## ✨ Готово к использованию!

Просто запустите оба .bat файла и начинайте работать с задачами!

