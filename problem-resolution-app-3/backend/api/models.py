from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Modèle utilisateur personnalisé"""
    USER_ROLES = [
        ("Operateur", "Operateur"),
        ("Chef d'équipe", "Chef d'équipe"),
        ("Superviseur", "Superviseur"),
        ("Responsable", "Responsable"),
        ("Manager", "Manager"),
    ]
    
    nom = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=USER_ROLES)
    service = models.CharField(max_length=255)
    competence = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'username']
    
    # Ajouter des related_name personnalisés pour éviter les conflits
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='api_user_set',
        related_query_name='api_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='api_user_set',
        related_query_name='api_user',
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.nom} ({self.role})"


class Team(models.Model):
    """Modèle pour les équipes"""
    nom_equipe = models.CharField(max_length=255)
    date_creation = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams_created')
    
    class Meta:
        db_table = 'teams'
        verbose_name = 'Équipe'
        verbose_name_plural = 'Équipes'
    
    def __str__(self):
        return self.nom_equipe


class TeamMember(models.Model):
    """Modèle pour les membres d'équipe"""
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_memberships')
    role_in_team = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'team_members'
        unique_together = ['team', 'user']
        verbose_name = 'Membre d\'équipe'
        verbose_name_plural = 'Membres d\'équipe'
    
    def __str__(self):
        return f"{self.user.nom} - {self.team.nom_equipe}"


class Problem(models.Model):
    """Modèle pour les problèmes"""
    STATUS_CHOICES = [
        ("Ouvert", "Ouvert"),
        ("En cours", "En cours"),
        ("Clôturé", "Clôturé"),
    ]
    
    LEVEL_CHOICES = [
        ("Usine", "Usine"),
        ("Ligne", "Ligne"),
        ("Atelier", "Atelier"),
    ]
    
    titre = models.CharField(max_length=255)
    description = models.TextField()
    date_declaration = models.DateField()
    declared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='problems_declared')
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='problems')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Ouvert")
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    qui = models.CharField(max_length=255, blank=True, null=True)
    quoi = models.CharField(max_length=255, blank=True, null=True)
    ou = models.CharField(max_length=255, blank=True, null=True)
    quand = models.CharField(max_length=255, blank=True, null=True)
    comment = models.CharField(max_length=255, blank=True, null=True)
    combien = models.CharField(max_length=255, blank=True, null=True)
    pourquoi = models.TextField(blank=True, null=True)
    photos = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'problems'
        verbose_name = 'Problème'
        verbose_name_plural = 'Problèmes'
        ordering = ['-date_declaration']
    
    def __str__(self):
        return self.titre


class Step8D(models.Model):
    """Modèle pour les étapes 8D"""
    STATUS_CHOICES = [
        ("Non commencé", "Non commencé"),
        ("En cours", "En cours"),
        ("Terminé", "Terminé"),
    ]
    
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='steps_assigned')
    date_start = models.DateField(null=True, blank=True)
    date_end = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Non commencé")
    proof = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'steps_8d'
        verbose_name = 'Étape 8D'
        verbose_name_plural = 'Étapes 8D'
        ordering = ['problem', 'step_number']
        unique_together = ['problem', 'step_number']
    
    def __str__(self):
        return f"D{self.step_number} - {self.problem.titre}"


class Action(models.Model):
    """Modèle pour les actions correctives"""
    STATUS_CHOICES = [
        ("Non commencé", "Non commencé"),
        ("En cours", "En cours"),
        ("Terminé", "Terminé"),
        ("Validé", "Validé"),
    ]
    
    step = models.ForeignKey(Step8D, on_delete=models.CASCADE, related_name='actions')
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='actions_assigned')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Non commencé")
    date_due = models.DateField(null=True, blank=True)
    proof = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'actions'
        verbose_name = 'Action'
        verbose_name_plural = 'Actions'
        ordering = ['step', 'date_due']
    
    def __str__(self):
        return f"{self.description[:50]}..."


class Notification(models.Model):
    """Modèle pour les notifications"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    step = models.ForeignKey(Step8D, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    message = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-date_created']
    
    def __str__(self):
        return f"{self.user.nom} - {self.message[:50]}..."


class History(models.Model):
    """Modèle pour l'historique des actions"""
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='history')
    step = models.ForeignKey(Step8D, on_delete=models.CASCADE, null=True, blank=True, related_name='history')
    action = models.TextField()
    performed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='history_actions')
    date_performed = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'history'
        verbose_name = 'Historique'
        verbose_name_plural = 'Historiques'
        ordering = ['-date_performed']
    
    def __str__(self):
        return f"{self.action[:50]}... - {self.performed_by.nom}"

