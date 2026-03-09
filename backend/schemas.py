from pydantic import BaseModel, Field
from typing import Optional


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    name: Optional[str] = None
    icon: Optional[str] = None


class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    link: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None  # Low, Medium, High, Highest
    is_completed: Optional[bool] = False
    is_draft: Optional[bool] = False
    value: Optional[int] = Field(None, ge=1, le=5)
    reach: Optional[int] = Field(None, ge=1, le=5)
    budget_impact: Optional[float] = Field(None, ge=1.0, le=2.0)
    confidence: Optional[int] = Field(None, ge=0, le=100)
    is_important: Optional[int] = Field(None, ge=0, le=1)
    is_urgent: Optional[int] = Field(None, ge=0, le=1)
    project_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None
    is_completed: Optional[bool] = None
    is_draft: Optional[bool] = None
    value: Optional[int] = Field(None, ge=1, le=5)
    reach: Optional[int] = Field(None, ge=1, le=5)
    budget_impact: Optional[float] = Field(None, ge=1.0, le=2.0)
    confidence: Optional[int] = Field(None, ge=0, le=100)
    is_important: Optional[int] = Field(None, ge=0, le=1)
    is_urgent: Optional[int] = Field(None, ge=0, le=1)
    project_id: Optional[int] = None


class Task(TaskBase):
    id: int
    rice_score: Optional[float] = None
    auto_priority: Optional[str] = None
    rice_category: str
    eisenhower_quadrant: Optional[str] = None
    project: Optional[Project] = None

    class Config:
        from_attributes = True

