# ⚡ Commandes Rapides - Solution à Votre Erreur

## 🔴 Problème Actuel

Vous avez deux problèmes :
1. ❌ `psycopg` au lieu de `psycopg2-binary` dans requirements.txt
2. ❌ Le dossier `migrations` n'existe pas dans `api/`

## ✅ Solution - Copiez-Collez Ces Commandes

### Dans VS Code Terminal (dans le dossier backend)

```bash
# 1. Désinstaller psycopg (mauvais package)
pip uninstall psycopg -y

# 2. Installer le bon package
pip install psycopg2-binary==2.9.9

# 3. Créer les migrations pour votre application
python manage.py makemigrations api

# 4. Appliquer toutes les migrations
python manage.py migrate
```

## 📋 Explication

### Étape 1 : Désinstaller psycopg
`psycopg` (version 3) n'est pas compatible avec Django. Il faut `psycopg2-binary`.

### Étape 2 : Installer psycopg2-binary
C'est le bon package pour PostgreSQL avec Django.

### Étape 3 : Créer les migrations
Cela crée les fichiers de migration pour vos modèles (User, Team, Problem, etc.)

### Étape 4 : Appliquer les migrations
Cela crée les tables dans votre base de données PostgreSQL.

## ✅ Après Ces Commandes

Vous devriez voir :
```
Migrations for 'api':
  api/migrations/0001_initial.py
    - Create model User
    - Create model Team
    - Create model Problem
    - Create model Step8D
    - Create model Action
    - Create model Notification
    - Create model History

Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
```

## 🎯 Ensuite

Une fois que ça fonctionne, continuez avec :

```bash
# Initialiser les données de test
python manage.py init_data

# Lancer le serveur
python manage.py runserver
```

## 🆘 Si Vous Avez Encore des Erreurs

1. **Vérifiez que vous êtes dans le bon dossier** :
   ```bash
   cd C:\Users\Bahsi\Documents\problem-resolution-app-3\backend
   ```

2. **Vérifiez que l'environnement virtuel est activé** :
   Vous devriez voir `(venv)` au début de votre ligne de commande.

3. **Vérifiez le fichier .env** :
   Assurez-vous qu'il existe dans `backend/.env` avec le bon mot de passe PostgreSQL.

