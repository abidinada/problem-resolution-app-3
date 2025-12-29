from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Team, TeamMember, Problem, Step8D, Action, Notification, History


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['nom', 'email', 'role', 'service', 'competence']
    list_filter = ['role', 'service']
    search_fields = ['nom', 'email']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('nom', 'role', 'service', 'competence')}),
    )


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['nom_equipe', 'date_creation', 'created_by']
    list_filter = ['date_creation']
    search_fields = ['nom_equipe']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['team', 'user', 'role_in_team']
    list_filter = ['team', 'role_in_team']


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ['titre', 'status', 'level', 'date_declaration', 'declared_by']
    list_filter = ['status', 'level', 'date_declaration']
    search_fields = ['titre', 'description']
    date_hierarchy = 'date_declaration'


@admin.register(Step8D)
class Step8DAdmin(admin.ModelAdmin):
    list_display = ['problem', 'step_number', 'status', 'assigned_to', 'date_start']
    list_filter = ['status', 'step_number']
    search_fields = ['problem__titre', 'description']


@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    list_display = ['step', 'status', 'assigned_to', 'date_due']
    list_filter = ['status', 'date_due']
    search_fields = ['description']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'is_read', 'date_created']
    list_filter = ['is_read', 'date_created']
    search_fields = ['message', 'user__nom']


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ['problem', 'action', 'performed_by', 'date_performed']
    list_filter = ['date_performed']
    search_fields = ['action', 'problem__titre']

