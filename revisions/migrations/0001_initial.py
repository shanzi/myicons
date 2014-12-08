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
                ('action', models.CharField(db_index=True, max_length=7, choices=[(b'create', b'Create a new record'), (b'update', b'Update a existing record'), (b'delete', b'Delete a record'), (b'restore', b'restor deleted records')])),
                ('model', models.CharField(db_index=True, max_length=14, choices=[(b'pack', b'Pack models'), (b'collection', b'Collection models'), (b'collectionicon', b'CollectionIcon models')])),
                ('target_id', models.IntegerField(db_index=True)),
                ('target_name', models.CharField(max_length=128)),
                ('ref_model', models.CharField(db_index=True, max_length=10, choices=[(b'pack', b'Pack models'), (b'collection', b'Collection models')])),
                ('ref_id', models.IntegerField(db_index=True)),
                ('ref_name', models.CharField(default=b'', max_length=128, blank=True)),
                ('user', jsonfield.fields.JSONField(default=None, null=True, blank=True)),
                ('snapshot', jsonfield.fields.JSONField(default=None, null=True, blank=True)),
                ('diff', jsonfield.fields.JSONField(default=None, null=True, blank=True)),
                ('is_restored', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
