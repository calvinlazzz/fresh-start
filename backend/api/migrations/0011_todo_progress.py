# Generated by Django 5.1.4 on 2024-12-24 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_todo_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='progress',
            field=models.IntegerField(default=0),
        ),
    ]
