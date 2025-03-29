from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import User, Reader, Librarian, LibraryCard, Book, Borrow, Reserve, Review
from .serializers import (
    UserSerializer, ReaderSerializer, LibrarianSerializer,
    LibraryCardSerializer, BookSerializer, BorrowSerializer,
    ReserveSerializer, ReviewSerializer
)

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

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'Librarian':
            return Borrow.objects.all()
        return Borrow.objects.filter(user=self.request.user)

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