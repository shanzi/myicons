# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0004_auto_20141122_1514'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='revision',
            name='username',
        ),
        migrations.AddField(
            model_name='revision',
            name='user',
            field=jsonfield.fields.JSONField(default={}),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='revision',
            name='diff',
            field=jsonfield.fields.JSONField(default={}),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='revision',
            name='model',
            field=models.CharField(db_index=True, max_length=14, choices=[(b'pack', b'Pack models'), (b'collection', b'Collection models'), (b'collectionicon', b'CollectionIcon models')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='revision',
            name='snapshot',
            field=jsonfield.fields.JSONField(default={}),
            preserve_default=True,
        ),
    ]
