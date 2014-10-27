# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pack',
            name='license_fulltext',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='pack',
            name='prefix',
            field=models.CharField(default=b'', max_length=16, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='packicon',
            name='pack',
            field=models.ForeignKey(related_name='icons', blank=True, to='iconpacks.Pack', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='packicon',
            name='tagnames',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
    ]
