# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0002_auto_20141027_1121'),
    ]

    operations = [
        migrations.AddField(
            model_name='pack',
            name='build_name',
            field=models.CharField(default=b'', max_length=128, blank=True),
            preserve_default=True,
        ),
    ]
