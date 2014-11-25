# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0006_auto_20141122_0822'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='packicon',
            name='tagnames',
        ),
        migrations.AddField(
            model_name='packicon',
            name='search_text_for',
            field=models.CharField(default=b'', max_length=128, db_index=True, blank=True),
            preserve_default=True,
        ),
    ]
