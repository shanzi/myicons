# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0005_auto_20141122_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='target_name',
            field=models.CharField(default='', max_length=128),
            preserve_default=False,
        ),
    ]
