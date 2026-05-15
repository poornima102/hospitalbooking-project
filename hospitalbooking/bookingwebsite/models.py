from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


# -------------------------
# USER MANAGER
# -------------------------
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)

        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True

        user.save(using=self._db)
        return user


# -------------------------
# CUSTOM USER MODEL
# -------------------------
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)

    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    contactno = models.CharField(max_length=15, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


# -------------------------
# DOCTORS MODEL
# -------------------------
class Doctors(models.Model):
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    field = models.CharField(max_length=50)
    experience = models.CharField(max_length=30)
    qualification = models.CharField(max_length=50)
    image = models.ImageField(upload_to='doctors/', null=True, blank=True)

    available_days = models.CharField(max_length=255, null=True, blank=True)
    available_time_slots = models.JSONField(default=list, blank=True)

    view_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name


# -------------------------
# APPOINTMENT MODEL
# -------------------------
class Appointment(models.Model):

    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    TIME_SLOTS = [
        ('9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM'),
        ('10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'),
        ('11:00 AM - 12:00 PM', '11:00 AM - 12:00 PM'),
        ('1:00 PM - 2:00 PM', '1:00 PM - 2:00 PM'),
        ('2:00 PM - 3:00 PM', '2:00 PM - 3:00 PM'),
        ('3:00 PM - 4:00 PM', '3:00 PM - 4:00 PM'),
    ]

    time_slot = models.CharField(max_length=50, choices=TIME_SLOTS)

    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    doctors = models.ForeignKey(Doctors, on_delete=models.CASCADE)

    appointment_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='confirmed'
    )

    class Meta:
        unique_together = ('patient', 'doctors', 'appointment_date')

    def __str__(self):
        return f"{self.patient.email} - {self.doctors.name}"


# -------------------------
# FEEDBACK MODEL
# -------------------------
class Feedback(models.Model):
    doctor = models.ForeignKey(Doctors, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'user')

    def __str__(self):
        return f"{self.user.email} - {self.doctor.name}"