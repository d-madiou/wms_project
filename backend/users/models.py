from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import TimeStampedModel, SoftDeleteModel

class User(AbstractUser, TimeStampedModel, SoftDeleteModel):
    """
    let's build a custom user model that extends AbstractUser and includes soft delete functionality and role based access control.
    """

    #let's create a tuple for role choices
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'User Manager'),
        ('operator', 'Operator'),
        ('driver', 'Driver'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
