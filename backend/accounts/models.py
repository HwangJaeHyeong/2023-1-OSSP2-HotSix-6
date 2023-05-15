# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Group(models.Model):
    group_code = models.IntegerField(db_column='Group_Code', primary_key=True)  # Field name made lowercase.
    group_name = models.CharField(db_column='Group_Name', max_length=10, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.
    creator_id = models.CharField(db_column='Creator_ID', max_length=100, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group'


class GroupMember(models.Model):
    group_code = models.OneToOneField(Group, models.DO_NOTHING, db_column='Group_Code', primary_key=True)  # Field name made lowercase.
    member = models.ForeignKey('User', models.DO_NOTHING, db_column='Member_ID')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group_member'


class GroupNotice(models.Model):
    notice_id = models.IntegerField(db_column='Notice_ID', primary_key=True)  # Field name made lowercase.
    group_code = models.ForeignKey(Group, models.DO_NOTHING, db_column='Group_Code')  # Field name made lowercase.
    notice_title = models.CharField(db_column='Notice_Title', max_length=15, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.       
    notice_content = models.CharField(db_column='Notice_Content', max_length=100, db_collation='utf8mb4_0900_ai_ci', blank=True, null=True)  # Field name made lowercase.
    notice_date = models.DateField(db_column='Notice_Date')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group_notice'


class GroupProject(models.Model):
    project_id = models.IntegerField(db_column='Project_ID', primary_key=True)  # Field name made lowercase.
    group_code = models.ForeignKey(Group, models.DO_NOTHING, db_column='Group_Code')  # Field name made lowercase.
    project_name = models.CharField(db_column='Project_Name', max_length=15, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.       
    project_progress = models.IntegerField(db_column='Project_Progress')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group_project'


class GroupSchedule(models.Model):
    schedule_id = models.IntegerField(db_column='Schedule_ID', primary_key=True)  # Field name made lowercase.
    group_code = models.ForeignKey(Group, models.DO_NOTHING, db_column='Group_Code')  # Field name made lowercase.
    schedule_title = models.CharField(db_column='Schedule_Title', max_length=15, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.   
    schedule_content = models.CharField(db_column='Schedule_Content', max_length=100, db_collation='utf8mb4_0900_ai_ci', blank=True, null=True)  # Field name made lowercase.
    start_time = models.DateField(db_column='Start_Time')  # Field name made lowercase.
    end_time = models.DateField(db_column='End_Time')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group_schedule'


class GroupTimetable(models.Model):
    timetable_id = models.IntegerField(db_column='Timetable_ID', primary_key=True)  # Field name made lowercase.
    group_code = models.ForeignKey(Group, models.DO_NOTHING, db_column='Group_Code')  # Field name made lowercase.
    start_time = models.DateField(db_column='Start_Time')  # Field name made lowercase.
    end_time = models.DateField(db_column='End_Time')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'group_timetable'


class Time(models.Model):
    time_id = models.CharField(db_column='Time_ID', primary_key=True, max_length=15, db_collation='utf8mb4_0900_ai_ci')  # Field name made lowercase.
    email = models.ForeignKey('User', models.DO_NOTHING, db_column='Email')  # Field name made lowercase.
    day = models.IntegerField(db_column='Day')  # Field name made lowercase.
    time = models.IntegerField(db_column='Time')  # Field name made lowercase.
    preference = models.IntegerField(db_column='Preference', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'time'


class User(models.Model):
    email = models.CharField(db_column='Email', primary_key=True, max_length=100)  # Field name made lowercase.
    password = models.CharField(db_column='Password', max_length=100)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=10)  # Field name made lowercase.
    join_date = models.DateField(db_column='Join_Date')  # Field name made lowercase.
    # authentication = models.IntegerField(db_column='Authentication')  # Field name made lowercase.
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'user'