# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0007_auto_20141123_0513'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='ref_id',
            field=models.IntegerField(default=1, db_index=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='revision',
            name='refmodel',
            field=models.CharField(default='', max_length=10, db_index=True, choices=[(b'pack', b'Pack models'), (b'collection', b'Collection models')]),
            preserve_default=False,
        ),
    ]
