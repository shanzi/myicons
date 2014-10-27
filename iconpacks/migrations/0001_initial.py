# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pack',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, db_index=True)),
                ('prefix', models.CharField(default=b'', max_length=16)),
                ('author', models.CharField(max_length=128)),
                ('author_email', models.EmailField(max_length=75)),
                ('website', models.URLField()),
                ('github', models.URLField(blank=True)),
                ('cdn', models.URLField(blank=True)),
                ('license', models.CharField(max_length=64)),
                ('license_fulltext', models.TextField(default=b'')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PackIcon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, db_index=True)),
                ('svg_d', models.TextField()),
                ('svg_unicode', models.IntegerField()),
                ('width', models.FloatField(default=1.0)),
                ('tagnames', models.TextField(default=b'')),
                ('pack', models.ForeignKey(related_name='icons', to='iconpacks.Pack')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
