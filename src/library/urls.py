from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import overdue_users_summary

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'readers', views.ReaderViewSet)
router.register(r'librarians', views.LibrarianViewSet)
router.register(r'library-cards', views.LibraryCardViewSet)
router.register(r'books', views.BookViewSet)
router.register(r'borrows', views.BorrowViewSet)
router.register(r'reserves', views.ReserveViewSet)
router.register(r'reviews', views.ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Mapping to register, login, logout views
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    # Mapping to list of users with overdue books
    path('overdue-users/', overdue_users_summary, name='overdue-users'),
]