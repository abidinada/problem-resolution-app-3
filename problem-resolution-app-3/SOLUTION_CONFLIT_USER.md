# 🔧 Solution - Erreur de Conflit User Model

## ❌ Problème

L'erreur indique un conflit entre votre modèle User personnalisé et le modèle User par défaut de Django. C'est parce que les relations ManyToMany (`groups` et `user_permissions`) ont le même `related_name`.

## ✅ Solution Appliquée

J'ai fait deux corrections :

### 1. Décommenté AUTH_USER_MODEL dans settings.py

Le fichier `backend/problem_resolution/settings.py` doit contenir :
```python
AUTH_USER_MODEL = 'api.User'
```

### 2. Ajouté des related_name personnalisés dans le modèle User

Dans `backend/api/models.py`, j'ai ajouté des `related_name` personnalisés pour éviter les conflits :
```python
groups = models.ManyToManyField(
    'auth.Group',
    related_name='api_user_set',  # ← Nom personnalisé
    ...
)
user_permissions = models.ManyToManyField(
    'auth.Permission',
    related_name='api_user_set',  # ← Nom personnalisé
    ...
)
```

## 🚀 Prochaines Étapes

Maintenant, exécutez ces commandes :

```bash
# 1. Supprimer les anciennes migrations (si elles existent)
del api\migrations\*.py

# 2. Recréer les migrations
python manage.py makemigrations api

# 3. Appliquer les migrations
python manage.py migrate

# 4. Initialiser les données de test
python manage.py init_data
```

## ✅ Vérification

Si tout fonctionne, vous devriez voir :
```
Migrations for 'api':
  api/migrations/0001_initial.py
    - Create model User
    ...

Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
  ...
```

Et ensuite :
```
Initializing test data...
Created user: Ahmed Benali
Created user: Fatima Zahra
...
Test data initialized successfully!
```

## 🎯 C'est Prêt !

Votre application devrait maintenant fonctionner correctement !

