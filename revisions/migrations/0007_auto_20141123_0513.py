# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revisions', '0006_revision_target_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='revision',
            name='revertable',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='revision',
            name='action',
            field=models.CharField(db_index=True, max_length=6, choices=[(b'create', b'Create a new record'), (b'update', b'Update a existing record'), (b'delete', b'Delete a record'), (b'revert', b'Revert a record')]),
            preserve_default=True,
        ),
    ]
