from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

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
]