from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('Reader', 'Reader'),
        ('Librarian', 'Librarian')
    ]

    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Reader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=255, null=True, blank=True)

class Librarian(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    position = models.CharField(max_length=50, null=True, blank=True)
    department = models.CharField(max_length=50, null=True, blank=True)

class LibraryCard(models.Model):
    card_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Book(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Borrowed', 'Borrowed'),
        ('Reserved', 'Reserved')
    ]

    book_id = models.AutoField(primary_key=True)
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    isbn = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    category = models.CharField(max_length=50)
    shelf_loc = models.CharField(max_length=50)

class Borrow(models.Model):
    borrow_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    due_date = models.DateField()
    delay_status = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['book'])
        ]

class Reserve(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Fulfilled', 'Fulfilled'),
        ('Canceled', 'Canceled')
    ]

    reserve_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isbn = models.CharField(max_length=50)
    reserve_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isbn = models.CharField(max_length=50)
    rating = models.IntegerField()
    comment = models.TextField()
    review_date = models.DateField()

    def clean(self):
        if not 1 <= self.rating <= 5:
            raise models.ValidationError('Rating must be between 1 and 5')