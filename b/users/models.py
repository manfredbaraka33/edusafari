from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
# from institutions.models import Institution

class MyUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)
    
USER_TYPES = [
    ('institution_user', 'Institution User'),
    ('regular_user', 'Regular User'),
    ('vendor_user', 'Vendor User'),
]


class MyUser(AbstractUser):
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='regular_user')
    
    # Override default groups and permissions to avoid clashes
    groups = models.ManyToManyField(
        Group,
        related_name='myuser_set',  # Unique reverse accessor
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='myuser_set',  # Unique reverse accessor
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = MyUserManager()

    def __str__(self):
        return self.username
    
    
    

class Favorite(models.Model):
    """
    User favorites for institutions.
    """
    user = models.ForeignKey(
        MyUser,
        on_delete=models.CASCADE,
        related_name="favorites"
    )
    institution = models.ForeignKey(
        "institutions.Institution",
        on_delete=models.CASCADE,
        related_name="favorites"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "institution")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} favorited {self.institution}"
