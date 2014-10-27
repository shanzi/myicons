import json

from django.db import models
from django.contrib.auth.models import User, make_password
from django.db.models.signals import post_save


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    labels_raw = models.TextField(editable=False)

    @property
    def labels(self):
        return json.loads(self.labels_raw) if self.labels_raw else []

    @labels.setter
    def labels(self, labels):
        labels_raw = json.dumps(labels)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


post_save.connect(create_user_profile, sender=User)
