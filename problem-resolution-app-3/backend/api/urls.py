from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, LoginView,
    TeamViewSet,
    ProblemViewSet,
    Step8DViewSet,
    ActionViewSet,
    NotificationViewSet,
    HistoryViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'problems', ProblemViewSet, basename='problem')
router.register(r'steps', Step8DViewSet, basename='step')
router.register(r'actions', ActionViewSet, basename='action')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'history', HistoryViewSet, basename='history')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]

