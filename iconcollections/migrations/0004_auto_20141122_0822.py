# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0003_auto_20141027_1121'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='token',
            field=models.CharField(default=b'', unique=True, max_length=32, editable=False, blank=True),
            preserve_default=True,
        ),
    ]
