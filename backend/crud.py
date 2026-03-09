from sqlalchemy.orm import Session
from typing import Optional, List
from backend import models, schemas


# Project CRUD
def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()


def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def get_project_by_name(db: Session, name: str):
    return db.query(models.Project).filter(models.Project.name == name).first()


def update_project(db: Session, project_id: int, project: schemas.ProjectUpdate):
    db_project = get_project(db, project_id)
    if db_project:
        for key, value in project.model_dump(exclude_unset=True).items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int):
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project


# Task CRUD
def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_tasks(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    project_id: Optional[int] = None,
    search: Optional[str] = None,
    assignee: Optional[str] = None,
    priority: Optional[str] = None,
    rice_category: Optional[str] = None,
    is_completed: Optional[bool] = None,
    is_draft: Optional[bool] = None
):
    query = db.query(models.Task)

    # Фильтр по завершенности
    if is_completed is not None:
        query = query.filter(models.Task.is_completed == is_completed)

    # Фильтр по черновикам
    if is_draft is not None:
        query = query.filter(models.Task.is_draft == is_draft)

    if project_id is not None:
        query = query.filter(models.Task.project_id == project_id)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Task.title.ilike(search_filter)) |
            (models.Task.description.ilike(search_filter))
        )

    if assignee:
        query = query.filter(models.Task.assignee == assignee)

    if priority:
        query = query.filter(models.Task.priority == priority)

    return query.offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def update_task(db: Session, task_id: int, task: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task:
        for key, value in task.model_dump(exclude_unset=True).items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task


# Analytics
def get_tasks_with_rice_score(db: Session, is_draft: Optional[bool] = None):
    """Получить все задачи с Rice Score"""
    query = db.query(models.Task).filter(
        models.Task.value.isnot(None),
        models.Task.reach.isnot(None),
        models.Task.budget_impact.isnot(None),
        models.Task.confidence.isnot(None)
    )

    if is_draft is not None:
        query = query.filter(models.Task.is_draft == is_draft)

    tasks = query.all()

    # Сортируем по rice_score
    return sorted(tasks, key=lambda t: t.rice_score or 0, reverse=True)


def get_tasks_by_eisenhower(db: Session):
    """Получить задачи, разделенные по квадрантам Эйзенхауэра"""
    tasks = db.query(models.Task).filter(
        models.Task.is_important.isnot(None),
        models.Task.is_urgent.isnot(None)
    ).all()

    result = {
        "important_urgent": [],
        "important_not_urgent": [],
        "not_important_urgent": [],
        "not_important_not_urgent": []
    }

    for task in tasks:
        if task.is_important and task.is_urgent:
            result["important_urgent"].append(task)
        elif task.is_important and not task.is_urgent:
            result["important_not_urgent"].append(task)
        elif not task.is_important and task.is_urgent:
            result["not_important_urgent"].append(task)
        else:
            result["not_important_not_urgent"].append(task)

    return result

