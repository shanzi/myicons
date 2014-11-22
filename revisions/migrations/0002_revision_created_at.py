# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2014, 11, 22, 14, 54, 37, 546030), db_index=True),
            preserve_default=False,
        ),
    ]
