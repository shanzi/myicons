# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('iconpacks', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, db_index=True)),
                ('build_name', models.CharField(max_length=128, db_index=True)),
                ('prefix', models.CharField(default=b'', max_length=16)),
                ('notes', models.CharField(default=b'', max_length=140)),
                ('token', models.CharField(unique=True, max_length=32)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CollectionIcon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=128, db_index=True)),
                ('svg_d', models.TextField(default=b'')),
                ('width', models.FloatField(default=1.0)),
                ('tagnames', models.TextField(default=b'')),
                ('collection', models.ForeignKey(related_name='icons', to='iconcollections.Collection')),
                ('packicon', models.ForeignKey(related_name='collectionicons', to='iconpacks.PackIcon')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
