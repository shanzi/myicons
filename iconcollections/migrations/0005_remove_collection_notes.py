# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0004_auto_20141122_0822'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collection',
            name='notes',
        ),
    ]
