# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0008_auto_20141123_0541'),
    ]

    operations = [
        migrations.RenameField(
            model_name='revision',
            old_name='refmodel',
            new_name='ref_model',
        ),
    ]
