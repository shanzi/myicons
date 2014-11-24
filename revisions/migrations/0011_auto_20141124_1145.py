# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0010_revision_ref_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='revision',
            name='revertable',
        ),
        migrations.AlterField(
            model_name='revision',
            name='action',
            field=models.CharField(db_index=True, max_length=7, choices=[(b'create', b'Create a new record'), (b'update', b'Update a existing record'), (b'delete', b'Delete a record'), (b'restore', b'restor deleted records')]),
            preserve_default=True,
        ),
    ]
