# Generated by Django 5.1.7 on 2025-03-20 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_alter_profilemodel_age_alter_profilemodel_avatar_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profilemodel",
            name="age",
            field=models.IntegerField(null=True),
        ),
    ]
