from rest_framework import serializers
from .models import User, Reader, Librarian, LibraryCard, Book, Borrow, Reserve, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']
        read_only_fields = ['user_id']

class ReaderSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Reader
        fields = '__all__'

class LibrarianSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Librarian
        fields = '__all__'

class LibraryCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryCard
        fields = '__all__'
        read_only_fields = ['card_id']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ['book_id']

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrow
        fields = '__all__'
        read_only_fields = ['borrow_id', 'delay_status']

class ReserveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserve
        fields = '__all__'
        read_only_fields = ['reserve_id']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['review_id']