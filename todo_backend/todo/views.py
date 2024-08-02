from rest_framework import generics, status, views
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer
from .services import generate_text


class TaskListCreate(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class GenerateTextView(views.APIView):
    def post(self, request, *args, **kwargs):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        generated_text = generate_text(prompt)
        return Response({"data": generated_text}, status=status.HTTP_200_OK)

# View which echoes back the input.
# This api does not interact with the database but merely returns a
# response based on the input
class EchoView(views.APIView):
    def post(self, request, *args, **kwargs):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"echo":prompt}, status=status.HTTP_200_OK)
    
# View which retrieves a task that has the completed field = false.
# Uses the Django database library to interact with the database.
# See https://docs.djangoproject.com/en/5.0/topics/db/queries/
#   for more examples on making database calls
class NextTaskView(views.APIView):
    def get(self, request, *args, **kwargs):
        incompleteTasks = Task.objects.filter(completed = False)
        if len(incompleteTasks) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)
        aTask = incompleteTasks[0]
        # once we have a model object, use the appropriate serializer
        # to serialize the response
        serializer = TaskSerializer(aTask)
        return Response(serializer.data, status=status.HTTP_200_OK)