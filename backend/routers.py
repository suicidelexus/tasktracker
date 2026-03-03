from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend import crud, schemas
from backend.database import get_db

router = APIRouter()


# Task Groups endpoints
@router.post("/groups/", response_model=schemas.TaskGroup)
def create_group(group: schemas.TaskGroupCreate, db: Session = Depends(get_db)):
    return crud.create_task_group(db, group)


@router.get("/groups/", response_model=List[schemas.TaskGroup])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_task_groups(db, skip=skip, limit=limit)


@router.get("/groups/{group_id}", response_model=schemas.TaskGroup)
def read_group(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.get_task_group(db, group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group


@router.put("/groups/{group_id}", response_model=schemas.TaskGroup)
def update_group(group_id: int, group: schemas.TaskGroupUpdate, db: Session = Depends(get_db)):
    db_group = crud.update_task_group(db, group_id, group)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group


@router.delete("/groups/{group_id}")
def delete_group(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.delete_task_group(db, group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"message": "Group deleted"}


# Tasks endpoints
@router.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)


@router.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    group_id: Optional[int] = None,
    search: Optional[str] = None,
    assignee: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_tasks(db, skip=skip, limit=limit, group_id=group_id, search=search, assignee=assignee)


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
def get_rice_scoring_tasks(db: Session = Depends(get_db)):
    """Получить задачи с Rice Score, отсортированные по приоритету"""
    return crud.get_tasks_with_rice_score(db)


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

