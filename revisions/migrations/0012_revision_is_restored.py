# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0011_auto_20141124_1145'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='is_restored',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
