# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='notes',
            field=models.CharField(default=b'', max_length=140, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collection',
            name='prefix',
            field=models.CharField(default=b'', max_length=16, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collection',
            name='token',
            field=models.CharField(unique=True, max_length=32, editable=False, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='collection',
            field=models.ForeignKey(related_name='icons', editable=False, to='iconcollections.Collection'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='packicon',
            field=models.ForeignKey(related_name='collectionicons', on_delete=django.db.models.deletion.SET_NULL, editable=False, to='iconpacks.PackIcon', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='svg_d',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='tagnames',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionicon',
            name='width',
            field=models.FloatField(default=1.0, blank=True),
            preserve_default=True,
        ),
    ]
