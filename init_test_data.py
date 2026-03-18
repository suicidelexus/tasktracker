"""
Простой скрипт для создания тестовых данных без эмодзи в выводе
"""
from backend.database import SessionLocal, engine, Base
from backend import crud, schemas
from backend.models import Project, Task

def create_test_data():
    # Создаем все таблицы заново
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Создаем проекты
        projects_data = [
            {"name": "Copilot", "description": "Задачи по Copilot", "icon": "robot"},
            {"name": "DA", "description": "Задачи по Data Analytics", "icon": "chart"},
            {"name": "Прочие", "description": "Прочие задачи", "icon": "list"}
        ]

        projects = {}
        for project_data in projects_data:
            project = crud.create_project(db, schemas.ProjectCreate(**project_data))
            projects[project_data["name"]] = project
            print(f"Created project: {project_data['name']}")

        # Создаем задачи
        tasks_data = [
            {
                "title": "Интеграция AI ассистента в VS Code",
                "description": "Разработать расширение для интеграции AI помощника в редактор кода",
                "link": "https://ideichny.com/task/1",
                "assignee": "Алексей Петров",
                "priority": "Highest",
                "value": 5,
                "reach": 5,
                "budget_impact": 2.0,
                "confidence": 90,
                "is_important": 1,
                "is_urgent": 1,
                "project_id": projects["Copilot"].id
            },
            {
                "title": "Оптимизация алгоритма автодополнения",
                "description": "Улучшить скорость работы автодополнения кода на 50%",
                "link": "https://ideichny.com/task/2",
                "assignee": "Мария Иванова",
                "priority": "High",
                "value": 4,
                "reach": 4,
                "budget_impact": 1.5,
                "confidence": 80,
                "is_important": 1,
                "is_urgent": 0,
                "project_id": projects["Copilot"].id
            },
            {
                "title": "Добавить поддержку Python 3.12",
                "description": "Обновить синтаксический анализатор для поддержки новых фич Python 3.12",
                "link": "https://ideichny.com/task/3",
                "assignee": "Дмитрий Сидоров",
                "priority": "Medium",
                "value": 3,
                "reach": 4,
                "budget_impact": 1.2,
                "confidence": 70,
                "is_important": 0,
                "is_urgent": 1,
                "project_id": projects["Copilot"].id
            },
            {
                "title": "Создать дашборд для метрик использования",
                "description": "Разработать интерактивный дашборд с ключевыми метриками",
                "link": "https://ideichny.com/task/4",
                "assignee": "Анна Козлова",
                "priority": "High",
                "value": 5,
                "reach": 3,
                "budget_impact": 1.5,
                "confidence": 80,
                "is_important": 1,
                "is_urgent": 1,
                "project_id": projects["DA"].id
            },
            {
                "title": "Настроить сбор аналитики пользовательского поведения",
                "description": "Интегрировать систему трекинга событий для анализа поведения пользователей",
                "link": "https://ideichny.com/task/5",
                "assignee": "Сергей Новиков",
                "priority": "Medium",
                "value": 4,
                "reach": 3,
                "budget_impact": 1.2,
                "confidence": 60,
                "is_important": 1,
                "is_urgent": 0,
                "project_id": projects["DA"].id
            },
            {
                "title": "Создать отчет по A/B тестированию",
                "description": "Проанализировать результаты A/B теста новой функции",
                "link": "https://ideichny.com/task/6",
                "assignee": "Анна Козлова",
                "priority": "Low",
                "value": 2,
                "reach": 2,
                "budget_impact": 1.0,
                "confidence": 50,
                "is_important": 0,
                "is_urgent": 0,
                "project_id": projects["DA"].id
            },
            {
                "title": "Обновить документацию API",
                "description": "Актуализировать документацию после последних изменений в API",
                "link": "https://ideichny.com/task/7",
                "assignee": "Ольга Смирнова",
                "priority": "Medium",
                "value": 2,
                "reach": 4,
                "budget_impact": 1.0,
                "confidence": 90,
                "is_important": 0,
                "is_urgent": 1,
                "project_id": projects["Прочие"].id
            },
            {
                "title": "Исправить критические баги",
                "description": "Устранить 5 критических багов из списка приоритетных",
                "link": "https://ideichny.com/task/8",
                "assignee": "Иван Волков",
                "priority": "Highest",
                "value": 5,
                "reach": 5,
                "budget_impact": 1.5,
                "confidence": 100,
                "is_important": 1,
                "is_urgent": 1,
                "project_id": projects["Прочие"].id
            },
            {
                "title": "Провести код-ревью новых фич",
                "description": "Проверить код новых функций перед релизом",
                "link": "https://ideichny.com/task/9",
                "assignee": "Петр Морозов",
                "priority": "High",
                "value": 3,
                "reach": 3,
                "budget_impact": 1.0,
                "confidence": 80,
                "is_important": 1,
                "is_urgent": 0,
                "project_id": projects["Прочие"].id
            },
            {
                "title": "Настроить CI/CD пайплайн",
                "description": "Автоматизировать процесс сборки и деплоя приложения",
                "link": "https://ideichny.com/task/10",
                "assignee": "Александр Лебедев",
                "priority": "Low",
                "value": 3,
                "reach": 2,
                "budget_impact": 1.2,
                "confidence": 40,
                "is_important": 0,
                "is_urgent": 0,
                "project_id": projects["Прочие"].id
            }
        ]
        # Создаем задачи
        created_count = 0
        for task_data in tasks_data:
            try:
                task = crud.create_task(db, schemas.TaskCreate(**task_data))
                created_count += 1
                print(f"Created task: {task.title}")
            except Exception as e:
                print(f"Error creating task: {e}")

        # Создаем черновики для Priority Score (is_draft=True)
        draft_tasks_data = [
            {
                "title": "Новая функция авторизации через SSO",
                "value": 5,
                "reach": 4,
                "budget_impact": 1.5,
                "confidence": 70,
                "is_draft": True
            },
            {
                "title": "Интеграция с Slack для уведомлений",
                "value": 3,
                "reach": 5,
                "budget_impact": 1.2,
                "confidence": 80,
                "is_draft": True
            },
            {
                "title": "Темная тема для приложения",
                "value": 2,
                "reach": 3,
                "budget_impact": 1.0,
                "confidence": 90,
                "is_draft": True
            },
            {
                "title": "Экспорт отчетов в PDF",
                "value": 4,
                "reach": 4,
                "budget_impact": 1.5,
                "confidence": 60,
                "is_draft": True
            },
            {
                "title": "Мультиязычность интерфейса",
                "value": 5,
                "reach": 5,
                "budget_impact": 2.0,
                "confidence": 50,
                "is_draft": True
            }
        ]

        draft_count = 0
        for draft_data in draft_tasks_data:
            try:
                draft = crud.create_task(db, schemas.TaskCreate(**draft_data))
                draft_count += 1
                print(f"Created draft: {draft.title}")
            except Exception as e:
                print(f"Error creating draft: {e}")

        print(f"\n[SUCCESS] Created {created_count} tasks and {draft_count} drafts in {len(projects)} projects")

    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("[START] Creating test data...")
    create_test_data()
    print("[DONE]")

