# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0002_revision_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='username',
            field=models.CharField(default='', max_length=64, db_index=True),
            preserve_default=False,
        ),
    ]
