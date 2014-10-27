# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0002_auto_20141027_1107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectionicon',
            name='collection',
            field=models.ForeignKey(related_name='icons', to='iconcollections.Collection'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='packicon',
            field=models.ForeignKey(related_name='collectionicons', on_delete=django.db.models.deletion.SET_NULL, to='iconpacks.PackIcon', null=True),
            preserve_default=True,
        ),
    ]
