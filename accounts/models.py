import json

from django.db import models
from django.contrib.auth.models import User, make_password
from django.db.models.signals import post_save

from jsonfield import JSONField


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    labels = JSONField()


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


post_save.connect(create_user_profile, sender=User)
