from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)  # Эмодзи или иконка для проекта

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    link = Column(String, nullable=True)  # Ссылка на Идеичную
    assignee = Column(String, nullable=True)  # Исполнитель
    priority = Column(String, nullable=True)  # Low, Medium, High, Highest
    is_completed = Column(Boolean, default=False, nullable=False)  # Завершена ли задача
    is_draft = Column(Boolean, default=False, nullable=False)  # Черновик (для Priority Score)

    # Rice Scoring параметры
    value = Column(Integer, nullable=True)  # 1-5
    reach = Column(Integer, nullable=True)  # 1-5
    budget_impact = Column(Float, nullable=True)  # 1, 1.2, 1.5, 2
    confidence = Column(Integer, nullable=True)  # 10, 20, 30...100

    # Матрица Эйзенхауэра
    is_important = Column(Integer, nullable=True)  # 0 = нет, 1 = да
    is_urgent = Column(Integer, nullable=True)  # 0 = нет, 1 = да

    # Связь с проектом
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project = relationship("Project", back_populates="tasks")

    @property
    def rice_score(self):
        """Вычисление Rice Score: Priority Score = Value × Reach × Budget Impact × Confidence"""
        if all([self.value, self.reach, self.budget_impact, self.confidence]):
            return self.value * self.reach * self.budget_impact * (self.confidence / 100)
        return None

    @property
    def auto_priority(self):
        """Автоматический приоритет на основе Rice Score"""
        score = self.rice_score
        if score is None:
            return None
        if score >= 40:
            return "Highest"
        elif score >= 25:
            return "High"
        elif score >= 10:
            return "Medium"
        else:
            return "Low"

    @property
    def rice_category(self):
        """Категория по Rice Score"""
        score = self.rice_score
        if score is None:
            return "Не оценено"
        if score >= 40:
            return "В работу"
        elif score >= 25:
            return "Кандидат"
        elif score >= 10:
            return "Требуется уточнение"
        else:
            return "Не берём"

    @property
    def eisenhower_quadrant(self):
        """Квадрант матрицы Эйзенхауэра"""
        if self.is_important is None or self.is_urgent is None:
            return None

        if self.is_important and self.is_urgent:
            return "Важно и срочно"
        elif self.is_important and not self.is_urgent:
            return "Важно, не срочно"
        elif not self.is_important and self.is_urgent:
            return "Не важно, срочно"
        else:
            return "Не важно, не срочно"

