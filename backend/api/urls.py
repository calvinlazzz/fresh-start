from django.urls import path
from . import views
from .views import fetch_weather


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
                                                  
    # Todo URLS
    path("todo/<user_id>/", views.TodoListView.as_view()),
    path("todo-detail/<user_id>/<todo_id>/", views.TodoDetailView.as_view()),
    path("todo-mark-as-complete/<user_id>/<todo_id>/", views.TodoMarkAsCompleted.as_view()),
    path('get-quote/', views.get_quote, name='get_quote'),
    path('update-todo-order/', views.update_todo_order, name='update_todo_order'), # New endpoint
    path('weather/<str:city>/', fetch_weather, name='fetch_weather'),



]