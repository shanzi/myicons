# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='labels_raw',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='labels',
            field=jsonfield.fields.JSONField(default=dict),
            preserve_default=True,
        ),
    ]
