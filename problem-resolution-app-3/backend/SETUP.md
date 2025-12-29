# Guide de configuration du backend Django

## Prérequis

- Python 3.8 ou supérieur
- PostgreSQL (via Neon)
- pip (gestionnaire de paquets Python)

## Installation

1. **Créer un environnement virtuel** :
```bash
cd backend
python -m venv venv
```

2. **Activer l'environnement virtuel** :
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. **Installer les dépendances** :
```bash
pip install -r requirements.txt
```

4. **Créer le fichier .env** (optionnel, pour la clé secrète) :
```bash
# Créer un fichier .env avec:
SECRET_KEY=votre-clé-secrète-ici
DEBUG=True
```

5. **Effectuer les migrations** :
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Créer un superutilisateur** (optionnel) :
```bash
python manage.py createsuperuser
```

7. **Lancer le serveur** :
```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

## Configuration de la base de données

La base de données est déjà configurée pour Neon PostgreSQL dans `settings.py`. Les informations de connexion sont :
- Host: ep-hidden-sky-agr8aiv3.c-2.eu-central-1.aws.neon.tech
- Database: neondb
- User: neondb_owner
- Port: 5432
- SSL: Requis

## Structure de l'API

Tous les endpoints sont préfixés par `/api/` :
- `/api/login/` - Authentification
- `/api/users/` - Gestion des utilisateurs
- `/api/teams/` - Gestion des équipes
- `/api/problems/` - Gestion des problèmes
- `/api/steps/` - Gestion des étapes 8D
- `/api/actions/` - Gestion des actions
- `/api/notifications/` - Gestion des notifications
- `/api/history/` - Historique

## Test de l'API

Vous pouvez tester l'API avec curl ou Postman :

```bash
# Lister les problèmes
curl http://localhost:8000/api/problems/

# Créer un problème
curl -X POST http://localhost:8000/api/problems/ \
  -H "Content-Type: application/json" \
  -d '{"titre": "Test", "description": "Description", "date_declaration": "2025-01-20", "declared_by_id": 1, "level": "Atelier"}'
```

## Notes importantes

- Le modèle User personnalisé est utilisé (AUTH_USER_MODEL = 'api.User')
- CORS est configuré pour permettre les requêtes depuis localhost:3000
- L'authentification est simple (email/password) pour l'instant
- Tous les endpoints sont accessibles sans authentification (AllowAny) pour faciliter le développement

