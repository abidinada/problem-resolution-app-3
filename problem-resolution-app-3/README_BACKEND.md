# Backend Django - Problem Resolution App

Backend Django REST Framework pour l'application de résolution de problèmes basée sur la méthodologie 8D.

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2. Configuration de la base de données

La base de données Neon PostgreSQL est déjà configurée dans `settings.py`. Aucune configuration supplémentaire n'est nécessaire.

### 3. Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Initialiser les données de test (optionnel)

```bash
python manage.py init_data
```

Cela créera :
- 5 utilisateurs de test (Manager, Responsable, Superviseur, Chef d'équipe, Opérateur)
- 2 équipes
- 2 problèmes

Les mots de passe par défaut sont : `password123`

### 5. Lancer le serveur

```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

## 📡 Endpoints API

### Authentification
- `POST /api/login/` - Connexion utilisateur

### Utilisateurs
- `GET /api/users/` - Liste des utilisateurs
- `POST /api/users/` - Créer un utilisateur
- `GET /api/users/{id}/` - Détails d'un utilisateur
- `PUT /api/users/{id}/` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}/` - Supprimer un utilisateur

### Problèmes
- `GET /api/problems/` - Liste des problèmes
- `POST /api/problems/` - Créer un problème
- `GET /api/problems/{id}/` - Détails d'un problème
- `PATCH /api/problems/{id}/` - Mettre à jour un problème
- `DELETE /api/problems/{id}/` - Supprimer un problème
- `GET /api/problems/{id}/steps/` - Étapes 8D d'un problème
- `PATCH /api/problems/{id}/update_status/` - Mettre à jour le statut

### Étapes 8D
- `GET /api/steps/` - Liste des étapes
- `POST /api/steps/` - Créer une étape
- `POST /api/steps/initialize_steps/` - Initialiser les 8 étapes pour un problème
- `GET /api/steps/{id}/actions/` - Actions d'une étape
- `PATCH /api/steps/{id}/update_status/` - Mettre à jour le statut

### Actions
- `GET /api/actions/` - Liste des actions
- `POST /api/actions/` - Créer une action
- `PATCH /api/actions/{id}/update_status/` - Mettre à jour le statut

### Notifications
- `GET /api/notifications/by_user/?user_id={id}` - Notifications d'un utilisateur
- `PATCH /api/notifications/{id}/mark_read/` - Marquer comme lue
- `PATCH /api/notifications/mark_all_read/` - Marquer toutes comme lues

### Historique
- `GET /api/history/by_problem/?problem_id={id}` - Historique d'un problème

## 🔗 Intégration avec le frontend React

### Configuration

1. Créer un fichier `.env.local` à la racine du projet React :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

2. Le fichier `lib/api.js` contient toutes les fonctions pour communiquer avec l'API.

### Exemple d'utilisation

```javascript
import { getProblems, createProblem, login } from '@/lib/api';

// Se connecter
const response = await login('ahmed.benali@usine.com', 'password123');
const user = response.user;

// Récupérer les problèmes
const problems = await getProblems();

// Créer un problème
const newProblem = await createProblem({
  titre: 'Nouveau problème',
  description: 'Description du problème',
  date_declaration: '2025-01-20',
  declared_by_id: user.id,
  level: 'Atelier',
});
```

## 🗄️ Structure de la base de données

- **User** - Utilisateurs avec rôles (Manager, Responsable, Superviseur, Chef d'équipe, Opérateur)
- **Team** - Équipes de résolution
- **TeamMember** - Membres des équipes
- **Problem** - Problèmes avec analyse QQOQCCP
- **Step8D** - Les 8 étapes de la méthodologie
- **Action** - Actions correctives
- **Notification** - Notifications pour les utilisateurs
- **History** - Historique des actions

## 🔒 Sécurité

- CORS configuré pour `localhost:3000`
- Authentification par email/password
- Tous les endpoints sont actuellement en `AllowAny` pour faciliter le développement

## 📝 Notes

- Le modèle User personnalisé est utilisé (`AUTH_USER_MODEL = 'api.User'`)
- Les mots de passe sont hashés avec Django
- Les dates sont au format ISO (YYYY-MM-DD)
- Les photos sont stockées en JSON (array de strings)

## 🛠️ Administration Django

Accéder à l'interface d'administration sur `http://localhost:8000/admin/` après avoir créé un superutilisateur :

```bash
python manage.py createsuperuser
```

