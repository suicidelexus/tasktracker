from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from backend import crud, schemas
from backend.database import get_db
from backend.excel_utils import create_excel_template, parse_excel_file

router = APIRouter()


# Projects endpoints
@router.post("/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db, project)


@router.get("/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_projects(db, skip=skip, limit=limit)


@router.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id, project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.delete_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}


# Tasks endpoints
@router.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)


@router.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    project_id: Optional[int] = None,
    search: Optional[str] = None,
    assignee: Optional[str] = None,
    priority: Optional[str] = None,
    rice_category: Optional[str] = None,
    is_completed: Optional[bool] = None,
    is_draft: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    return crud.get_tasks(
        db,
        skip=skip,
        limit=limit,
        project_id=project_id,
        search=search,
        assignee=assignee,
        priority=priority,
        rice_category=rice_category,
        is_completed=is_completed,
        is_draft=is_draft
    )


@router.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id, task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.delete_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}


# Analytics endpoints
@router.get("/analytics/rice", response_model=List[schemas.Task])
def get_rice_scoring_tasks(is_draft: Optional[bool] = None, db: Session = Depends(get_db)):
    """Получить задачи с Rice Score, отсортированные по приоритету"""
    return crud.get_tasks_with_rice_score(db, is_draft=is_draft)


@router.get("/analytics/eisenhower")
def get_eisenhower_matrix(db: Session = Depends(get_db)):
    """Получить задачи, разделенные по квадрантам Матрицы Эйзенхауэра"""
    result = crud.get_tasks_by_eisenhower(db)
    # Преобразуем задачи в схемы
    return {
        "important_urgent": [schemas.Task.model_validate(t) for t in result["important_urgent"]],
        "important_not_urgent": [schemas.Task.model_validate(t) for t in result["important_not_urgent"]],
        "not_important_urgent": [schemas.Task.model_validate(t) for t in result["not_important_urgent"]],
        "not_important_not_urgent": [schemas.Task.model_validate(t) for t in result["not_important_not_urgent"]]
    }


# Excel import/export endpoints
@router.get("/tasks/excel/template")
def download_excel_template():
    """Скачать Excel шаблон для импорта задач"""
    template = create_excel_template()
    return StreamingResponse(
        template,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=tasks_template.xlsx"}
    )


@router.post("/tasks/excel/import")
async def import_tasks_from_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Импортировать задачи из Excel файла"""
    # Парсим файл
    tasks_data = await parse_excel_file(file)

    # Создаем задачи
    created_tasks = []
    for task_data in tasks_data:
        # Получаем или находим проект по имени
        project_id = None
        project_name = task_data.pop("project_name", None)

        if project_name:
            # Ищем проект по имени
            project = crud.get_project_by_name(db, project_name)
            if project:
                project_id = project.id
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Проект '{project_name}' не найден. Создайте проект перед импортом или оставьте поле пустым."
                )

        task_data["project_id"] = project_id

        # Создаем задачу
        task_create = schemas.TaskCreate(**task_data)
        created_task = crud.create_task(db, task_create)
        created_tasks.append(created_task)

    return {
        "message": f"Успешно импортировано {len(created_tasks)} задач(и)",
        "count": len(created_tasks),
        "tasks": [schemas.Task.model_validate(t) for t in created_tasks]
    }


