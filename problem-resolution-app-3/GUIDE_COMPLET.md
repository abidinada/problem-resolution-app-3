# 🚀 Guide Complet - Création du Site Web depuis Zéro

Ce guide vous accompagne étape par étape pour créer votre application complète avec PostgreSQL, pgAdmin, Django et React.

---

## 📋 Table des matières

1. [Installation des outils nécessaires](#1-installation-des-outils-nécessaires)
2. [Installation et configuration de PostgreSQL](#2-installation-et-configuration-de-postgresql)
3. [Installation et configuration de pgAdmin](#3-installation-et-configuration-de-pgadmin)
4. [Création de la base de données](#4-création-de-la-base-de-données)
5. [Configuration du backend Django](#5-configuration-du-backend-django)
6. [Configuration du frontend React](#6-configuration-du-frontend-react)
7. [Test de l'application complète](#7-test-de-lapplication-complète)

---

## 1. Installation des outils nécessaires

### 1.1 Installer Python

1. Téléchargez Python depuis [python.org](https://www.python.org/downloads/)
2. **IMPORTANT** : Cochez "Add Python to PATH" lors de l'installation
3. Vérifiez l'installation :
```bash
python --version
```

### 1.2 Installer Node.js et npm

1. Téléchargez Node.js depuis [nodejs.org](https://nodejs.org/)
2. Installez la version LTS (Long Term Support)
3. Vérifiez l'installation :
```bash
node --version
npm --version
```

---

## 2. Installation et configuration de PostgreSQL

### 2.1 Télécharger PostgreSQL

1. Allez sur [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Téléchargez le **PostgreSQL Installer** (version 15 ou 16)
3. Exécutez l'installateur

### 2.2 Installation de PostgreSQL

1. **Port** : Gardez le port par défaut `5432`
2. **Mot de passe** : Choisissez un mot de passe pour l'utilisateur `postgres` (notez-le bien !)
   - Exemple : `postgres123` (vous pouvez utiliser celui-ci)
3. **Locale** : Gardez les valeurs par défaut
4. Laissez cocher "Stack Builder" (optionnel)

### 2.3 Vérifier l'installation

1. Ouvrez **pgAdmin 4** (installé automatiquement avec PostgreSQL)
2. Vous devriez voir un serveur "PostgreSQL 15" (ou 16)
3. Cliquez dessus et entrez le mot de passe que vous avez défini

---

## 3. Installation et configuration de pgAdmin

### 3.1 pgAdmin est déjà installé

pgAdmin 4 est installé automatiquement avec PostgreSQL. Si vous ne le voyez pas :

1. Recherchez "pgAdmin 4" dans le menu Démarrer
2. Ou allez dans : `C:\Program Files\pgAdmin 4\runtime\pgAdmin4.exe`

### 3.2 Première connexion à pgAdmin

1. Ouvrez pgAdmin 4
2. La première fois, on vous demande un mot de passe maître pour pgAdmin
   - Choisissez un mot de passe simple (ex: `admin123`)
   - Ce mot de passe est pour pgAdmin uniquement, pas pour PostgreSQL
3. Dans le panneau gauche, vous verrez "Servers"
4. Cliquez sur "PostgreSQL 15" (ou 16)
5. Entrez le mot de passe PostgreSQL que vous avez défini à l'installation

---

## 4. Création de la base de données

### 4.1 Créer la base de données dans pgAdmin

1. Dans pgAdmin, cliquez droit sur **"Databases"** (sous votre serveur PostgreSQL)
2. Sélectionnez **"Create"** → **"Database..."**
3. Remplissez :
   - **Database name** : `problem_resolution_db`
   - **Owner** : `postgres` (par défaut)
4. Cliquez sur **"Save"**

### 4.2 Vérifier la création

1. Vous devriez voir `problem_resolution_db` dans la liste des bases de données
2. Cliquez dessus pour l'ouvrir

---

## 5. Configuration du backend Django

### 5.1 Ouvrir le terminal dans le dossier backend

1. Ouvrez PowerShell ou CMD
2. Naviguez vers votre projet :
```bash
cd C:\Users\Bahsi\Documents\problem-resolution-app-3\backend
```

### 5.2 Créer un environnement virtuel Python

```bash
python -m venv venv
```

### 5.3 Activer l'environnement virtuel

**Windows PowerShell :**
```bash
.\venv\Scripts\Activate.ps1
```

Si vous avez une erreur, exécutez d'abord :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Windows CMD :**
```bash
venv\Scripts\activate.bat
```

Vous devriez voir `(venv)` au début de votre ligne de commande.

### 5.4 Installer les dépendances

```bash
pip install -r requirements.txt
```

### 5.5 Créer le fichier .env

1. Dans le dossier `backend`, créez un fichier nommé `.env`
2. Ajoutez ce contenu (remplacez `postgres123` par votre mot de passe PostgreSQL) :

```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
DB_NAME=problem_resolution_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
```

**⚠️ IMPORTANT** : Remplacez `postgres123` par le mot de passe que vous avez défini lors de l'installation de PostgreSQL !

### 5.6 Effectuer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

Si tout fonctionne, vous devriez voir :
```
Operations to perform:
  Apply all migrations: ...
Running migrations:
  ...
```

### 5.7 Créer un superutilisateur (optionnel)

```bash
python manage.py createsuperuser
```

Remplissez les informations demandées.

### 5.8 Initialiser les données de test

```bash
python manage.py init_data
```

Cela créera :
- 5 utilisateurs de test
- 2 équipes
- 2 problèmes

**Mots de passe des utilisateurs de test** : `password123`

### 5.9 Lancer le serveur Django

```bash
python manage.py runserver
```

Vous devriez voir :
```
Starting development server at http://127.0.0.1:8000/
```

**✅ Le backend est maintenant en cours d'exécution !**

### 5.10 Tester le backend

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:8000/api/problems/`
3. Vous devriez voir une liste JSON des problèmes (peut être vide si vous n'avez pas initialisé les données)

---

## 6. Configuration du frontend React

### 6.1 Ouvrir un nouveau terminal

Ouvrez un **nouveau terminal** (gardez celui du backend ouvert).

### 6.2 Naviguer vers le dossier racine du projet

```bash
cd C:\Users\Bahsi\Documents\problem-resolution-app-3
```

### 6.3 Installer les dépendances Node.js

```bash
npm install
```

Cela peut prendre quelques minutes.

### 6.4 Créer le fichier .env.local

1. À la racine du projet (même niveau que `package.json`), créez un fichier `.env.local`
2. Ajoutez ce contenu :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 6.5 Lancer le serveur de développement

```bash
npm run dev
```

Vous devriez voir :
```
  ▲ Next.js ...
  - Local:        http://localhost:3000
```

**✅ Le frontend est maintenant en cours d'exécution !**

### 6.6 Ouvrir l'application

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3000`
3. Vous devriez voir votre application React

---

## 7. Test de l'application complète

### 7.1 Vérifier la connexion frontend-backend

1. Dans l'application React, essayez de vous connecter avec :
   - **Email** : `ahmed.benali@usine.com`
   - **Password** : `password123`

2. Si la connexion fonctionne, vous êtes connecté !

### 7.2 Vérifier les données dans pgAdmin

1. Dans pgAdmin, ouvrez `problem_resolution_db`
2. Allez dans **Schemas** → **public** → **Tables**
3. Vous devriez voir toutes les tables :
   - `users`
   - `teams`
   - `problems`
   - `steps_8d`
   - `actions`
   - `notifications`
   - `history`

4. Cliquez droit sur une table → **View/Edit Data** → **All Rows**
5. Vous devriez voir les données que vous avez créées

### 7.3 Tester l'API directement

Dans votre navigateur, testez ces URLs :

- `http://localhost:8000/api/users/` - Liste des utilisateurs
- `http://localhost:8000/api/problems/` - Liste des problèmes
- `http://localhost:8000/api/teams/` - Liste des équipes

---

## 🎯 Résumé des commandes importantes

### Backend (dans le dossier `backend`)

```bash
# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt

# Migrations
python manage.py makemigrations
python manage.py migrate

# Initialiser les données
python manage.py init_data

# Lancer le serveur
python manage.py runserver
```

### Frontend (dans le dossier racine)

```bash
# Installer les dépendances
npm install

# Lancer le serveur
npm run dev
```

---

## 🔧 Dépannage

### Erreur : "psycopg2" non trouvé

```bash
pip install psycopg2-binary
```

### Erreur : Impossible de se connecter à PostgreSQL

1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez le mot de passe dans `.env`
3. Vérifiez que le port est `5432`

### Erreur : Port 8000 déjà utilisé

```bash
python manage.py runserver 8001
```

Puis changez l'URL dans `.env.local` du frontend.

### Erreur : Port 3000 déjà utilisé

```bash
npm run dev -- -p 3001
```

### Erreur CORS

Vérifiez que `corsheaders` est bien installé :
```bash
pip install django-cors-headers
```

---

## 📝 Fichiers de configuration créés

### Backend (`backend/.env`)
```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
DB_NAME=problem_resolution_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## ✅ Checklist finale

- [ ] PostgreSQL installé et fonctionnel
- [ ] pgAdmin ouvert et connecté
- [ ] Base de données `problem_resolution_db` créée
- [ ] Environnement virtuel Python créé et activé
- [ ] Dépendances Python installées
- [ ] Fichier `.env` créé dans `backend/`
- [ ] Migrations effectuées
- [ ] Données de test initialisées
- [ ] Serveur Django en cours d'exécution (port 8000)
- [ ] Dépendances Node.js installées
- [ ] Fichier `.env.local` créé à la racine
- [ ] Serveur Next.js en cours d'exécution (port 3000)
- [ ] Application accessible sur `http://localhost:3000`
- [ ] Connexion fonctionnelle
- [ ] Données visibles dans pgAdmin

---

## 🎉 Félicitations !

Votre application est maintenant complètement configurée et fonctionnelle !

- **Frontend** : `http://localhost:3000`
- **Backend API** : `http://localhost:8000/api`
- **Admin Django** : `http://localhost:8000/admin`
- **Base de données** : Accessible via pgAdmin

---

## 📚 Ressources supplémentaires

- [Documentation Django](https://docs.djangoproject.com/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation pgAdmin](https://www.pgadmin.org/docs/)


