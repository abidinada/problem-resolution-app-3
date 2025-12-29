# ⚡ Guide Rapide - Commandes Essentielles

## 🚀 Démarrage Rapide

### 1. Backend Django

```bash
# Aller dans le dossier backend
cd backend

# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Si l'environnement virtuel n'existe pas encore
python -m venv venv
.\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env (copier depuis .env.example et modifier le mot de passe)
# Puis effectuer les migrations
python manage.py makemigrations
python manage.py migrate

# Initialiser les données de test
python manage.py init_data

# Lancer le serveur
python manage.py runserver
```

### 2. Frontend React

```bash
# Dans un nouveau terminal, aller à la racine du projet
cd C:\Users\Bahsi\Documents\problem-resolution-app-3

# Installer les dépendances (si pas déjà fait)
npm install

# Créer le fichier .env.local avec :
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Lancer le serveur
npm run dev
```

## 📝 Fichiers à créer

### `backend/.env`
```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
DB_NAME=problem_resolution_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRES
DB_HOST=localhost
DB_PORT=5432
```

### `.env.local` (racine du projet)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🔑 Identifiants de test

- **Email** : `ahmed.benali@usine.com`
- **Password** : `password123`

## 🌐 URLs

- Frontend : http://localhost:3000
- Backend API : http://localhost:8000/api
- Admin Django : http://localhost:8000/admin


