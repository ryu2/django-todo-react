from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import generate_shopping_list

class TaskListCreate(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(['POST'])
def shopping_list(request):
    dish_name = request.data.get('dish_name')
    if not dish_name:
        return Response({"error": "Dish name is required"}, status=400)
    shopping_list = generate_shopping_list(dish_name)
    return Response({"shopping_list": shopping_list})