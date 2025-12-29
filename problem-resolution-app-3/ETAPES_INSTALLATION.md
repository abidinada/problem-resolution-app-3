# 📋 Étapes d'Installation - Résumé

## ✅ Étape 1 : Installer PostgreSQL et pgAdmin

1. Téléchargez PostgreSQL : https://www.postgresql.org/download/windows/
2. Installez PostgreSQL (gardez le port 5432)
3. **Notez le mot de passe** que vous définissez pour l'utilisateur `postgres`
4. pgAdmin 4 est installé automatiquement

## ✅ Étape 2 : Créer la base de données dans pgAdmin

1. Ouvrez pgAdmin 4
2. Connectez-vous avec le mot de passe PostgreSQL
3. Clic droit sur "Databases" → "Create" → "Database..."
4. Nom : `problem_resolution_db`
5. Cliquez sur "Save"

## ✅ Étape 3 : Configurer le Backend Django

### 3.1 Ouvrir le terminal dans le dossier backend

```bash
cd C:\Users\Bahsi\Documents\problem-resolution-app-3\backend
```

### 3.2 Créer et activer l'environnement virtuel

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3.3 Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3.4 Créer le fichier .env

Créez un fichier `.env` dans le dossier `backend/` avec ce contenu :

```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
DB_NAME=problem_resolution_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_ICI
DB_HOST=localhost
DB_PORT=5432
```

**⚠️ Remplacez `VOTRE_MOT_DE_PASSE_ICI` par le mot de passe PostgreSQL que vous avez défini !**

### 3.5 Effectuer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3.6 Initialiser les données de test

```bash
python manage.py init_data
```

### 3.7 Lancer le serveur

```bash
python manage.py runserver
```

Le backend sera accessible sur : `http://localhost:8000`

## ✅ Étape 4 : Configurer le Frontend React

### 4.1 Ouvrir un nouveau terminal

Ouvrez un **nouveau terminal** (gardez celui du backend ouvert).

### 4.2 Aller à la racine du projet

```bash
cd C:\Users\Bahsi\Documents\problem-resolution-app-3
```

### 4.3 Installer les dépendances (si pas déjà fait)

```bash
npm install
```

### 4.4 Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4.5 Lancer le serveur

```bash
npm run dev
```

Le frontend sera accessible sur : `http://localhost:3000`

## ✅ Étape 5 : Tester l'application

1. Ouvrez votre navigateur : `http://localhost:3000`
2. Connectez-vous avec :
   - Email : `ahmed.benali@usine.com`
   - Password : `password123`

## 🎯 Vérification dans pgAdmin

1. Ouvrez pgAdmin
2. Allez dans `problem_resolution_db` → `Schemas` → `public` → `Tables`
3. Vous devriez voir toutes les tables créées
4. Clic droit sur une table → "View/Edit Data" → "All Rows"
5. Vous devriez voir les données

## 📝 Checklist

- [ ] PostgreSQL installé
- [ ] Base de données `problem_resolution_db` créée dans pgAdmin
- [ ] Fichier `.env` créé dans `backend/` avec le bon mot de passe
- [ ] Migrations effectuées
- [ ] Données de test initialisées
- [ ] Backend en cours d'exécution (port 8000)
- [ ] Fichier `.env.local` créé à la racine
- [ ] Frontend en cours d'exécution (port 3000)
- [ ] Application accessible et fonctionnelle

## 🆘 En cas de problème

### Erreur de connexion à PostgreSQL

1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez le mot de passe dans `.env`
3. Vérifiez que le port est 5432

### Erreur "psycopg2 not found"

```bash
pip install psycopg2-binary
```

### Port déjà utilisé

Pour Django (port 8000) :
```bash
python manage.py runserver 8001
```

Pour Next.js (port 3000) :
```bash
npm run dev -- -p 3001
```

Pensez à mettre à jour les URLs dans `.env.local` si vous changez les ports.


