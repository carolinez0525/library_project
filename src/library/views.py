from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes

from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta

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

# Updated to allow librarians to view all cards & assign new card, readers to view own cards.
class LibraryCardViewSet(viewsets.ModelViewSet):
    queryset = LibraryCard.objects.all()
    serializer_class = LibraryCardSerializer

    def get_permissions(self):
        if self.action in ['assign']:
            return [IsLibrarian()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_card(self, request):
        try:
            card = LibraryCard.objects.get(user=request.user)
            return Response(LibraryCardSerializer(card).data)
        except LibraryCard.DoesNotExist:
            return Response({"message": "You don't have a library card."}, status=404)

    @action(detail=False, methods=['post'], permission_classes=[IsLibrarian])
    def assign(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "User ID is required."}, status=400)

        if LibraryCard.objects.filter(user_id=user_id).exists():
            return Response({"error": "User already has a library card."}, status=400)

        card = LibraryCard.objects.create(user_id=user_id)
        return Response(LibraryCardSerializer(card).data, status=201)


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
        user = self.request.user
        qs = Borrow.objects.all() if user.role == 'Librarian' else Borrow.objects.filter(user=user)

        # Optional filters for librarians only
        if user.role == 'Librarian':
            overdue = self.request.query_params.get('overdue')
            due_soon = self.request.query_params.get('due_soon')
            group_by_user = self.request.query_params.get('group_by_user')

            today = timezone.now().date()

            if overdue == 'true':
                qs = qs.filter(return_date__isnull=True, due_date__lt=today)

            if due_soon == 'true':
                soon = today + timedelta(days=3)
                qs = qs.filter(return_date__isnull=True, due_date__range=[today, soon])

            if group_by_user == 'true':
                return qs.values('user__email').distinct()

        return qs
    
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
    
    @action(detail=True, methods=['post'], permission_classes=[IsLibrarian])
    def fulfill(self, request, pk=None):
        reservation = self.get_object()

        if reservation.status != 'Pending':
            return Response({'message': 'Reservation already processed.'}, status=400)

        # Try to find an available book matching the reserved ISBN
        try:
            book = Book.objects.filter(isbn=reservation.isbn, status='Available').first()
            if not book:
                return Response({'message': 'No available copy for this ISBN.'}, status=400)
        except Book.DoesNotExist:
            return Response({'message': 'No such book found.'}, status=404)

        # Update reservation status
        reservation.status = 'Fulfilled'
        reservation.save()

        # Update book status
        book.status = 'Borrowed'
        book.save()

        # Create borrow record
        borrow = Borrow.objects.create(
            user=reservation.user,
            book=book,
            borrow_date=timezone.now().date(),
            due_date=timezone.now().date() + timedelta(days=14)  # default 2-week loan
        )

        return Response({
            'message': 'Reservation fulfilled and borrow record created.',
            'borrow_id': borrow.borrow_id
        }, status=200)

    @action(detail=True, methods=['post'], permission_classes=[IsLibrarian])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status != 'Pending':
            return Response({'message': 'Only pending reservations can be canceled.'}, status=400)

        reservation.status = 'Canceled'
        reservation.save()

        return Response({'message': 'Reservation canceled.'})
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
# -------------------------------
# Custom Librarian API View
# -------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def overdue_users_summary(request):
    if request.user.role != 'Librarian':
        return Response({"detail": "Only librarians can access this."}, status=403)

    today = timezone.now().date()
    overdue_qs = Borrow.objects.filter(
        return_date__isnull=True,
        due_date__lt=today
    ).values('user__email').annotate(overdue_count=Count('borrow_id'))

    results = [
        {
            "user_email": entry['user__email'],
            "overdue_count": entry['overdue_count']
        }
        for entry in overdue_qs
    ]

    return Response(results)