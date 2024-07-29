from django.urls import path
from .views import TaskListCreate, TaskDetail, shopping_list

urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('generate-shopping-list/', shopping_list, name='generate-shopping-list'),
]
