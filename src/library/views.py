from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import action
from django.utils import timezone
# from rest_framework.authtoken.models import Token  # Uncomment if using Token auth

from .models import User, Reader, Librarian, LibraryCard, Book, Borrow, Reserve, Review
from .serializers import (
    UserSerializer, ReaderSerializer, LibrarianSerializer,
    LibraryCardSerializer, BookSerializer, BorrowSerializer,
    ReserveSerializer, ReviewSerializer
)

from .permissions import IsLibrarian

# -------------------------------
# Authentication Views
# -------------------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # token, created = Token.objects.get_or_create(user=user)  # Optional
            return Response({
                "user": UserSerializer(user).data,
                # "token": token.key  # Optional if using token auth
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            # token, created = Token.objects.get_or_create(user=user)  # Optional
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                # "token": token.key  # Optional
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# -------------------------------
# API ViewSets
# -------------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ReaderViewSet(viewsets.ModelViewSet):
    queryset = Reader.objects.all()
    serializer_class = ReaderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LibrarianViewSet(viewsets.ModelViewSet):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LibraryCardViewSet(viewsets.ModelViewSet):
    queryset = LibraryCard.objects.all()
    serializer_class = LibraryCardSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Update BookViewSet to allow all users to view books and only librarians to modify
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsLibrarian()]
        return [permissions.IsAuthenticatedOrReadOnly()]

class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'Librarian':
            return Borrow.objects.all()
        return Borrow.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically assign the logged-in user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsLibrarian])
    def mark_returned(self, request, pk=None):
        borrow = self.get_object()

        if borrow.return_date:
            return Response({"message": "Book already marked as returned."}, status=400)

        borrow.return_date = timezone.now().date()
        borrow.delay_status = borrow.return_date > borrow.due_date

        borrow.book.status = "Available"
        borrow.book.save()
        borrow.save()

        return Response({"message": "Book marked as returned."}, status=200)


class ReserveViewSet(viewsets.ModelViewSet):
    queryset = Reserve.objects.all()
    serializer_class = ReserveSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'Librarian':
            return Reserve.objects.all()
        return Reserve.objects.filter(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        isbn = self.request.query_params.get('isbn', None)

        if isbn is not None:
            queryset = queryset.filter(isbn=isbn)

        return queryset