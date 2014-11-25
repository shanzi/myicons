# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0006_remove_collectionicon_tagnames'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectionicon',
            name='packicon',
            field=models.ForeignKey(related_name='collectionicons', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='iconpacks.PackIcon', null=True),
            preserve_default=True,
        ),
    ]
