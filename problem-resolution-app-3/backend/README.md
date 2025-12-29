# Backend Django - Problem Resolution App

Backend Django REST Framework pour l'application de résolution de problèmes basée sur la méthodologie 8D.

## Installation

1. Créer un environnement virtuel Python :
```bash
python -m venv venv
```

2. Activer l'environnement virtuel :
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

4. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

5. Effectuer les migrations :
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Créer un superutilisateur (optionnel) :
```bash
python manage.py createsuperuser
```

7. Lancer le serveur de développement :
```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

## Structure de l'API

### Endpoints disponibles

#### Authentification
- `POST /api/login/` - Connexion utilisateur

#### Utilisateurs
- `GET /api/users/` - Liste des utilisateurs
- `POST /api/users/` - Créer un utilisateur
- `GET /api/users/{id}/` - Détails d'un utilisateur
- `PUT /api/users/{id}/` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}/` - Supprimer un utilisateur

#### Équipes
- `GET /api/teams/` - Liste des équipes
- `POST /api/teams/` - Créer une équipe
- `GET /api/teams/{id}/` - Détails d'une équipe
- `PUT /api/teams/{id}/` - Mettre à jour une équipe
- `DELETE /api/teams/{id}/` - Supprimer une équipe
- `POST /api/teams/{id}/add_member/` - Ajouter un membre
- `DELETE /api/teams/{id}/remove_member/` - Retirer un membre

#### Problèmes
- `GET /api/problems/` - Liste des problèmes
- `POST /api/problems/` - Créer un problème
- `GET /api/problems/{id}/` - Détails d'un problème
- `PUT /api/problems/{id}/` - Mettre à jour un problème
- `DELETE /api/problems/{id}/` - Supprimer un problème
- `GET /api/problems/{id}/steps/` - Étapes 8D d'un problème
- `PATCH /api/problems/{id}/update_status/` - Mettre à jour le statut

#### Étapes 8D
- `GET /api/steps/` - Liste des étapes
- `POST /api/steps/` - Créer une étape
- `GET /api/steps/{id}/` - Détails d'une étape
- `PUT /api/steps/{id}/` - Mettre à jour une étape
- `DELETE /api/steps/{id}/` - Supprimer une étape
- `GET /api/steps/{id}/actions/` - Actions d'une étape
- `PATCH /api/steps/{id}/update_status/` - Mettre à jour le statut
- `POST /api/steps/initialize_steps/` - Initialiser les 8 étapes pour un problème

#### Actions
- `GET /api/actions/` - Liste des actions
- `POST /api/actions/` - Créer une action
- `GET /api/actions/{id}/` - Détails d'une action
- `PUT /api/actions/{id}/` - Mettre à jour une action
- `DELETE /api/actions/{id}/` - Supprimer une action
- `PATCH /api/actions/{id}/update_status/` - Mettre à jour le statut

#### Notifications
- `GET /api/notifications/` - Liste des notifications
- `POST /api/notifications/` - Créer une notification
- `GET /api/notifications/{id}/` - Détails d'une notification
- `PUT /api/notifications/{id}/` - Mettre à jour une notification
- `DELETE /api/notifications/{id}/` - Supprimer une notification
- `GET /api/notifications/by_user/?user_id={id}` - Notifications d'un utilisateur
- `PATCH /api/notifications/{id}/mark_read/` - Marquer comme lue
- `PATCH /api/notifications/mark_all_read/` - Marquer toutes comme lues

#### Historique
- `GET /api/history/` - Liste de l'historique
- `GET /api/history/{id}/` - Détails d'un historique
- `GET /api/history/by_problem/?problem_id={id}` - Historique d'un problème

## Base de données

Le projet utilise PostgreSQL avec Neon. La configuration de la base de données est définie dans `settings.py`.

## CORS

CORS est configuré pour permettre les requêtes depuis `http://localhost:3000` (Next.js).

## Admin Django

Accéder à l'interface d'administration Django sur `http://localhost:8000/admin/` après avoir créé un superutilisateur.

