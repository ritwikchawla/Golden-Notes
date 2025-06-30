from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('login/', views.login),
    path('register/', views.register),
    path('logout/', views.logout),
    path('profile/', views.getNotes),
    path('profile/addnote', views.addNote),
    path('profile/<int:id>', views.updateDelete),
]