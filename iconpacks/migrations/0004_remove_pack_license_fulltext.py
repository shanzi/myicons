# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0003_pack_build_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pack',
            name='license_fulltext',
        ),
    ]
