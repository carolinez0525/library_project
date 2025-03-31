from rest_framework import serializers
from .models import User, Reader, Librarian, LibraryCard, Book, Borrow, Reserve, Review

class UserSerializer(serializers.ModelSerializer):
    # handle password correctly and securely
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'role']
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # 🔐 hashes the password
        user.save()
        return user

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
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = LibraryCard
        fields = ['card_id', 'user', 'user_email']
        read_only_fields = ['user_email']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrow
        fields = '__all__'
        read_only_fields = ['borrow_id', 'delay_status', 'user', 'return_date']

class ReserveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserve
        fields = '__all__'
        read_only_fields = ['reserve_id', 'user']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['review_id']