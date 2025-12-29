# 🔧 Solution - Erreur "la relation « users » n'existe pas"

## ❌ Problème

L'erreur indique que Django essaie d'appliquer les migrations mais la table `users` n'existe pas encore. C'est parce que les migrations de votre application `api` n'ont pas été créées.

## ✅ Solution Étape par Étape

### Étape 1 : Corriger le requirements.txt

Le fichier `requirements.txt` doit utiliser `psycopg2-binary` et non `psycopg`.

**Vérifiez que votre `backend/requirements.txt` contient :**
```
Django==5.0.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

### Étape 2 : Réinstaller psycopg2-binary

Dans votre terminal (avec l'environnement virtuel activé) :

```bash
pip uninstall psycopg
pip install psycopg2-binary==2.9.9
```

### Étape 3 : Supprimer les migrations existantes (si nécessaire)

Si vous avez déjà essayé de faire des migrations, supprimez les fichiers de migration :

```bash
# Supprimer les fichiers de migration (sauf __init__.py)
del api\migrations\*.py
```

**⚠️ Ne supprimez PAS le dossier `migrations` ni le fichier `__init__.py` !**

### Étape 4 : Créer le dossier migrations (si nécessaire)

Si le dossier `migrations` n'existe pas dans `backend/api/` :

```bash
mkdir api\migrations
```

Créez un fichier `__init__.py` dans ce dossier (vide).

### Étape 5 : Créer les migrations pour l'application api

```bash
python manage.py makemigrations api
```

Vous devriez voir quelque chose comme :
```
Migrations for 'api':
  api/migrations/0001_initial.py
    - Create model User
    - Create model Team
    - Create model Problem
    ...
```

### Étape 6 : Appliquer toutes les migrations

```bash
python manage.py migrate
```

Cette fois, ça devrait fonctionner ! Vous devriez voir :
```
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
```

## 🎯 Commandes Complètes (Copier-Coller)

```bash
# 1. Désinstaller psycopg (si installé)
pip uninstall psycopg -y

# 2. Installer psycopg2-binary
pip install psycopg2-binary==2.9.9

# 3. Créer les migrations pour api
python manage.py makemigrations api

# 4. Appliquer toutes les migrations
python manage.py migrate
```

## ✅ Vérification

Après avoir exécuté ces commandes, vérifiez dans pgAdmin :

1. Ouvrez pgAdmin
2. Allez dans `problem_resolution_db` → `Schemas` → `public` → `Tables`
3. Vous devriez voir toutes les tables :
   - `users`
   - `teams`
   - `team_members`
   - `problems`
   - `steps_8d`
   - `actions`
   - `notifications`
   - `history`
   - Et les tables Django par défaut (auth_user, django_migrations, etc.)

## 🆘 Si ça ne fonctionne toujours pas

### Option 1 : Réinitialiser complètement

```bash
# Supprimer toutes les migrations
del api\migrations\*.py

# Recréer les migrations
python manage.py makemigrations api
python manage.py migrate
```

### Option 2 : Vérifier que l'application est bien dans INSTALLED_APPS

Vérifiez que `backend/problem_resolution/settings.py` contient :

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',  # ← Doit être présent !
]
```

### Option 3 : Vérifier la connexion à la base de données

Testez la connexion :

```bash
python manage.py dbshell
```

Si ça fonctionne, tapez `\q` pour quitter.

## 📝 Note Importante

- **psycopg** (version 3) ≠ **psycopg2-binary**
- Django nécessite **psycopg2-binary** (version 2)
- Ne confondez pas les deux !

