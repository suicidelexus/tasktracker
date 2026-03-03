from pydantic import BaseModel, Field
from typing import Optional


class TaskGroupBase(BaseModel):
    name: str
    description: Optional[str] = None


class TaskGroupCreate(TaskGroupBase):
    pass


class TaskGroupUpdate(TaskGroupBase):
    name: Optional[str] = None


class TaskGroup(TaskGroupBase):
    id: int

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    link: Optional[str] = None
    assignee: Optional[str] = None
    value: Optional[int] = Field(None, ge=1, le=5)
    reach: Optional[int] = Field(None, ge=1, le=5)
    budget_impact: Optional[float] = Field(None, ge=1.0, le=2.0)
    confidence: Optional[int] = Field(None, ge=0, le=100)
    is_important: Optional[int] = Field(None, ge=0, le=1)
    is_urgent: Optional[int] = Field(None, ge=0, le=1)
    group_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    assignee: Optional[str] = None
    value: Optional[int] = Field(None, ge=1, le=5)
    reach: Optional[int] = Field(None, ge=1, le=5)
    budget_impact: Optional[float] = Field(None, ge=1.0, le=2.0)
    confidence: Optional[int] = Field(None, ge=0, le=100)
    is_important: Optional[int] = Field(None, ge=0, le=1)
    is_urgent: Optional[int] = Field(None, ge=0, le=1)
    group_id: Optional[int] = None


class Task(TaskBase):
    id: int
    rice_score: Optional[float] = None
    rice_category: str
    eisenhower_quadrant: Optional[str] = None
    group: Optional[TaskGroup] = None

    class Config:
        from_attributes = True

