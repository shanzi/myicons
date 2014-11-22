# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('action', models.CharField(db_index=True, max_length=6, choices=[(b'create', b'Create a new record'), (b'update', b'Update a existing record'), (b'delete', b'Delete a record')])),
                ('model', models.CharField(db_index=True, max_length=15, choices=[(b'pack', b'Pack models'), (b'collection', b'Collection models'), (b'collection_icon', b'CollectionIcon models')])),
                ('target_id', models.IntegerField(db_index=True)),
                ('snapshot', jsonfield.fields.JSONField(default=dict)),
                ('diff', jsonfield.fields.JSONField(default=dict)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
