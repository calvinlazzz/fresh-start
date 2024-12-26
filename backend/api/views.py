from django.shortcuts import render
from django.http import JsonResponse
from api.models import User, Todo
from .quotes import get_quote
from .weather import get_weather
from rest_framework.decorators import api_view



from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, TodoSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
import json


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)

class TodoListView(generics.ListCreateAPIView):
    #queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        todo = Todo.objects.filter(user=user).order_by('order')
        return todo
    # def get_queryset(self):
    #     user_id = self.kwargs.get('user_id')
    #     if user_id:
    #         try:
    #             user = User.objects.get(id=user_id)
    #             return Todo.objects.filter(user=user)
    #         except User.DoesNotExist:
    #             return Todo.objects.none()
    #     return Todo.objects.all()

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    
    def get_object(self):
        user_id = self.kwargs['user_id']
        todo_id = self.kwargs['todo_id']
        
        user = User.objects.get(id=user_id)

        todo = Todo.objects.get(id=todo_id, user=user) 
        return todo

class TodoMarkAsCompleted(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        todo_id = self.kwargs['todo_id']
        
        user = User.objects.get(id=user_id)

        todo = Todo.objects.get(id=todo_id, user=user) 
        
        todo.completed = not todo.completed
        todo.save()
        return todo
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_todo_order(request):
    data = json.loads(request.body)
    for index, todo_id in enumerate(data['order']):
        todo = Todo.objects.get(id=todo_id)
        todo.order = index
        todo.save()
    return JsonResponse({'status': 'success'})


@api_view(['GET'])
def fetch_weather(request, city):
    weather_data = get_weather(city)
    return JsonResponse(weather_data, safe=False)

@api_view(['GET'])
def get_user_city(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({'city': user.city}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_city(request):
    user_id = request.data.get('user_id')
    city = request.data.get('city')
    if city and user_id:
        try:
            # Validate the city by fetching weather data
            weather_data = get_weather(city)
            if 'city' in weather_data:
                user = User.objects.get(id=user_id)
                user.city = city
                user.save()
                return Response({'message': 'City updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid city name'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'City or user_id not provided'}, status=status.HTTP_400_BAD_REQUEST)