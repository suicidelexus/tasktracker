from sqlalchemy.orm import Session
from typing import Optional, List
from backend import models, schemas


# TaskGroup CRUD
def create_task_group(db: Session, group: schemas.TaskGroupCreate):
    db_group = models.TaskGroup(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def get_task_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TaskGroup).offset(skip).limit(limit).all()


def get_task_group(db: Session, group_id: int):
    return db.query(models.TaskGroup).filter(models.TaskGroup.id == group_id).first()


def update_task_group(db: Session, group_id: int, group: schemas.TaskGroupUpdate):
    db_group = get_task_group(db, group_id)
    if db_group:
        for key, value in group.model_dump(exclude_unset=True).items():
            setattr(db_group, key, value)
        db.commit()
        db.refresh(db_group)
    return db_group


def delete_task_group(db: Session, group_id: int):
    db_group = get_task_group(db, group_id)
    if db_group:
        db.delete(db_group)
        db.commit()
    return db_group


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
    group_id: Optional[int] = None,
    search: Optional[str] = None,
    assignee: Optional[str] = None
):
    query = db.query(models.Task)

    if group_id is not None:
        query = query.filter(models.Task.group_id == group_id)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Task.title.ilike(search_filter)) |
            (models.Task.description.ilike(search_filter))
        )

    if assignee:
        query = query.filter(models.Task.assignee == assignee)

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
def get_tasks_with_rice_score(db: Session):
    """Получить все задачи с Rice Score"""
    tasks = db.query(models.Task).filter(
        models.Task.value.isnot(None),
        models.Task.reach.isnot(None),
        models.Task.budget_impact.isnot(None),
        models.Task.confidence.isnot(None)
    ).all()

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

