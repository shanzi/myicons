# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0004_remove_pack_license_fulltext'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pack',
            name='build_name',
        ),
    ]
