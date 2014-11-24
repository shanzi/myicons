# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconcollections', '0005_remove_collection_notes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collectionicon',
            name='tagnames',
        ),
    ]
