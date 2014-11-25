# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0007_auto_20141125_0651'),
    ]

    operations = [
        migrations.RenameField(
            model_name='packicon',
            old_name='search_text_for',
            new_name='search_text',
        ),
    ]
