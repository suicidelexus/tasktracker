# Task Tracker

Веб-приложение для управления задачами с аналитикой и приоритизацией.

## 🎉 Новые возможности (v2.0)

- ✅ **Drag & Drop** в Матрице Эйзенхауэра - перетаскивайте задачи между квадрантами
- ✅ **Excel-фильтры** во всех таблицах - фильтруйте как в Excel (иконка воронки)
- ✅ **Управление проектами** - редактирование и удаление проектов с переносом задач
- ✅ **Справка** - встроенная документация по методикам
- ✅ **Черновики в Priority Score** - предварительная оценка задач перед добавлением в работу

📖 **Подробнее:** [USER_GUIDE.md](USER_GUIDE.md) | [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

---

## Технологии

**Backend:**
- Python 3.14
- FastAPI
- SQLAlchemy
- SQLite
- openpyxl (работа с Excel)

**Frontend:**
- React 18
- React Router
- Axios
- Tailwind CSS

## Структура проекта

```
tasktracker/
├── backend/              # Backend модули
│   ├── crud.py          # CRUD операции с БД
│   ├── database.py      # Конфигурация БД
│   ├── excel_utils.py   # Работа с Excel файлами
│   ├── models.py        # SQLAlchemy модели
│   ├── routers.py       # API endpoints
│   └── schemas.py       # Pydantic схемы
├── frontend/            # React приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── pages/       # Страницы приложения
│   │   └── services/    # API клиент
│   └── package.json
├── main.py              # Точка входа FastAPI
├── init_test_data.py    # Скрипт создания тестовых данных
├── tasktracker.db       # База данных SQLite
├── requirements.txt     # Python зависимости
├── START_ALL.bat        # Запуск обоих серверов
├── start_backend.bat    # Запуск только backend
└── start_frontend.bat   # Запуск только frontend
```

## Быстрый старт

### 1. Установка зависимостей

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Запуск приложения

**Простой способ:**

Дважды кликните на `START_ALL.bat` - откроются 2 окна с серверами.

Подробные инструкции: [ЗАПУСК.md](ЗАПУСК.md)

**Ручной запуск:**
```bash
# Backend
py -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload

# Frontend (в другом терминале)
cd frontend
npm start
```

### 3. Создание тестовых данных

```bash
py init_test_data.py
```

Создаст:
- 10 задач в разделе "Все задачи"
- 5 черновиков в разделе "Priority Score"
- 3 проекта: Copilot, DA, Прочие

## Функциональность

### Основные возможности

- ✅ Создание и управление задачами
- ✅ Создание проектов с иконками
- ✅ Фильтрация по столбцам (Название, Исполнитель, Приоритет, Проект, Priority Score)
- ✅ Приоритизация задач (Low, Medium, High, Highest)
- ✅ Массовая загрузка задач из Excel
- ✅ Скачивание шаблона Excel для импорта
- ✅ Завершение задач и архивирование

### Аналитика

**Priority Score:**
- Расчёт приоритета задачи по формуле: `Value × Reach × Budget Impact × Confidence`
- Метрики:
  - Value (влияние) — 1-5
  - Reach (охват) — 1-5
  - Budget Impact — 1.0, 1.2, 1.5, 2.0
  - Confidence (уверенность) — 10%, 20%, ..., 100%
- Автоматическая категоризация:
  - **40+** → Берём в работу
  - **25-39** → Кандидат в работу
  - **10-24** → Требуется уточнение
  - **0-9** → Не берём в работу

**Матрица Эйзенхауэра:**
- Классификация задач по важности и срочности
- 4 квадранта для приоритизации

## API

Backend API: http://localhost:8080

**Документация:** http://localhost:8080/docs

### Основные endpoints

```
GET    /api/tasks/               # Список задач
POST   /api/tasks/               # Создать задачу
PUT    /api/tasks/{id}           # Обновить задачу
DELETE /api/tasks/{id}           # Удалить задачу

GET    /api/projects/            # Список проектов
POST   /api/projects/            # Создать проект
PUT    /api/projects/{id}        # Обновить проект
DELETE /api/projects/{id}        # Удалить проект

GET    /api/analytics/rice       # Priority Score аналитика
GET    /api/analytics/eisenhower # Матрица Эйзенхауэра

POST   /api/tasks/upload-excel   # Загрузка задач из Excel
GET    /api/tasks/download-template # Скачать шаблон Excel
```

## Доступ из локальной сети

Backend запущен с `--host 0.0.0.0`, что позволяет подключаться из локальной сети:

1. Узнайте свой IP: `ipconfig`
2. Найдите "IPv4 Address" (например, 192.168.1.100)
3. Другие пользователи могут открыть:
   - Frontend: `http://192.168.1.100:3000`
   - Backend API: `http://192.168.1.100:8080`

## Архитектура

### Backend

**Модули:**
- `models.py` - SQLAlchemy модели (Task, Project)
- `schemas.py` - Pydantic схемы для валидации
- `crud.py` - CRUD операции с базой данных
- `routers.py` - FastAPI endpoints
- `database.py` - Конфигурация SQLite
- `excel_utils.py` - Импорт/экспорт Excel

**База данных:** SQLite (`tasktracker.db`)

Таблицы создаются автоматически при запуске через SQLAlchemy.

### Frontend

**Структура:**
- `pages/` - Страницы приложения (AllTasks, RiceScoring, EisenhowerMatrix, Completed, ProjectView)
- `components/` - Переиспользуемые компоненты (Sidebar, TaskModal, ProjectModal)
- `services/` - API клиент (axios)

**Стилизация:** Tailwind CSS

**Роутинг:** React Router v6

## Лицензия

MIT

