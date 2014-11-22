# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0005_remove_pack_build_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pack',
            name='author_email',
            field=models.EmailField(default=b'', max_length=75, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='pack',
            name='license',
            field=models.CharField(max_length=128),
            preserve_default=True,
        ),
    ]
