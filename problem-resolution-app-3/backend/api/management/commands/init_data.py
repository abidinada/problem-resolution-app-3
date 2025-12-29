from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Team, Problem, Step8D, Action, Notification

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize test data'

    def handle(self, *args, **options):
        self.stdout.write('Initializing test data...')

        # Créer des utilisateurs de test
        users_data = [
            {
                'nom': 'Ahmed Benali',
                'role': 'Manager',
                'service': 'Direction',
                'competence': 'Management',
                'email': 'ahmed.benali@usine.com',
                'username': 'ahmed.benali',
                'password': 'password123',
            },
            {
                'nom': 'Fatima Zahra',
                'role': 'Responsable',
                'service': 'Qualité',
                'competence': 'Lean Management',
                'email': 'fatima.zahra@usine.com',
                'username': 'fatima.zahra',
                'password': 'password123',
            },
            {
                'nom': 'Mohamed Alami',
                'role': 'Superviseur',
                'service': 'Production Ligne A',
                'competence': 'Supervision',
                'email': 'mohamed.alami@usine.com',
                'username': 'mohamed.alami',
                'password': 'password123',
            },
            {
                'nom': 'Rachid Idrissi',
                'role': "Chef d'équipe",
                'service': 'Atelier 1',
                'competence': 'Assemblage',
                'email': 'rachid.idrissi@usine.com',
                'username': 'rachid.idrissi',
                'password': 'password123',
            },
            {
                'nom': 'Karim Tazi',
                'role': 'Operateur',
                'service': 'Atelier 1',
                'competence': 'Opération',
                'email': 'karim.tazi@usine.com',
                'username': 'karim.tazi',
                'password': 'password123',
            },
        ]

        users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults=user_data
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.nom}'))
            else:
                self.stdout.write(self.style.WARNING(f'User already exists: {user.nom}'))
            users.append(user)

        # Créer des équipes
        teams_data = [
            {
                'nom_equipe': "Équipe 8D - Défaut Ligne A",
                'date_creation': '2025-01-15',
                'created_by': users[2],  # Mohamed Alami
            },
            {
                'nom_equipe': "Équipe 8D - Retard Production",
                'date_creation': '2025-01-18',
                'created_by': users[1],  # Fatima Zahra
            },
        ]

        teams = []
        for team_data in teams_data:
            team, created = Team.objects.get_or_create(
                nom_equipe=team_data['nom_equipe'],
                defaults=team_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created team: {team.nom_equipe}'))
            else:
                self.stdout.write(self.style.WARNING(f'Team already exists: {team.nom_equipe}'))
            teams.append(team)

        # Créer des problèmes
        problems_data = [
            {
                'titre': 'Défaut de peinture sur pièces finies',
                'description': 'Présence de bulles dans la peinture sur 15% des pièces produites',
                'date_declaration': '2025-01-15',
                'declared_by': users[3],  # Rachid Idrissi
                'team': teams[0],
                'status': 'En cours',
                'level': 'Ligne',
                'qui': "Ligne A - Poste peinture",
                'quoi': 'Bulles dans la peinture',
                'ou': 'Zone de peinture automatique',
                'quand': '15 Janvier 2025, 14h30',
                'comment': 'Application automatique par robot',
                'combien': '15% des pièces',
                'pourquoi': 'À déterminer',
            },
            {
                'titre': 'Retard de production - Ligne B',
                'description': 'Retard accumulé de 2 heures sur planning quotidien',
                'date_declaration': '2025-01-18',
                'declared_by': users[3],  # Rachid Idrissi
                'team': teams[1],
                'status': 'Ouvert',
                'level': 'Ligne',
                'qui': "Ligne B - Équipe matin",
                'quoi': 'Retard de production',
                'ou': 'Ligne B complète',
                'quand': '18 Janvier 2025, matin',
                'comment': 'Ralentissement progressif',
                'combien': '2 heures de retard',
                'pourquoi': 'À analyser',
            },
        ]

        problems = []
        for problem_data in problems_data:
            problem, created = Problem.objects.get_or_create(
                titre=problem_data['titre'],
                defaults=problem_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created problem: {problem.titre}'))
            else:
                self.stdout.write(self.style.WARNING(f'Problem already exists: {problem.titre}'))
            problems.append(problem)

        self.stdout.write(self.style.SUCCESS('Test data initialized successfully!'))

