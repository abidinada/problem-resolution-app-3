# 🎯 Guide Visuel - Création de la Base de Données dans pgAdmin

## ❌ NE PAS REMPLIR LE FORMULAIRE DE CONNEXION

Le formulaire que vous voyez ("Let's connect to the server") est pour une connexion temporaire. **Vous n'en avez pas besoin !**

## ✅ LA BONNE MÉTHODE - Utiliser le serveur existant

### Étape 1 : Fermer le formulaire

1. Cliquez sur la **croix (X)** en haut à droite du formulaire pour le fermer
2. Ou cliquez sur l'onglet "Welcome" pour le fermer

### Étape 2 : Trouver le serveur PostgreSQL dans le panneau de gauche

Dans le **panneau de gauche** de pgAdmin, vous devriez voir :

```
📁 Servers
  └── 📊 PostgreSQL 15 (ou 16)
       └── 📁 Databases
       └── 📁 Login/Group Roles
       └── ...
```

### Étape 3 : Se connecter au serveur (si nécessaire)

1. **Cliquez sur "PostgreSQL 15"** (ou 16) dans le panneau de gauche
2. Si on vous demande un mot de passe :
   - Entrez le **mot de passe PostgreSQL** que vous avez défini lors de l'installation
   - Cochez "Save password" si vous voulez
   - Cliquez sur "OK"

### Étape 4 : Créer la base de données

1. **Cliquez droit** sur **"Databases"** (sous PostgreSQL 15)
2. Dans le menu, sélectionnez :
   ```
   Create → Database...
   ```

3. Une fenêtre s'ouvre avec un formulaire. Remplissez :
   - **Database name** : `problem_resolution_db`
   - **Owner** : Laissez `postgres` (par défaut)
   - Les autres champs peuvent rester par défaut

4. Cliquez sur le bouton **"Save"** en bas à droite

### Étape 5 : Vérifier la création

1. Dans le panneau de gauche, sous "Databases", vous devriez maintenant voir :
   ```
   📁 Databases
      └── 📊 problem_resolution_db  ← Votre nouvelle base !
      └── 📊 postgres
   ```

2. **Cliquez sur `problem_resolution_db`** pour l'ouvrir

3. Vous devriez voir :
   ```
   📁 problem_resolution_db
      └── 📁 Schemas
      └── 📁 Tables (vide pour l'instant)
   ```

## ✅ C'est fait !

Votre base de données est créée. Vous pouvez maintenant passer à l'étape suivante du guide (configuration du backend Django).

## 🆘 Si vous ne voyez pas "PostgreSQL 15" dans le panneau de gauche

### Option 1 : Ajouter le serveur manuellement

1. **Cliquez droit** sur "Servers" dans le panneau de gauche
2. Sélectionnez **"Register" → "Server..."**
3. Dans l'onglet **"General"** :
   - **Name** : `PostgreSQL Local` (ou n'importe quel nom)
4. Dans l'onglet **"Connection"** :
   - **Host name/address** : `localhost`
   - **Port** : `5432`
   - **Maintenance database** : `postgres`
   - **Username** : `postgres`
   - **Password** : Votre mot de passe PostgreSQL
5. Cliquez sur **"Save"**

### Option 2 : Vérifier que PostgreSQL est en cours d'exécution

1. Appuyez sur **Windows + R**
2. Tapez : `services.msc` et appuyez sur Entrée
3. Cherchez **"postgresql"** dans la liste
4. Si le statut n'est pas "En cours d'exécution", **cliquez droit** → **"Démarrer"**

## 📸 À quoi ça devrait ressembler

Après avoir créé la base de données, votre panneau de gauche devrait ressembler à :

```
📁 Servers
  └── 📊 PostgreSQL 15
       ├── 📁 Databases
       │    ├── 📊 problem_resolution_db  ← VOTRE BASE !
       │    └── 📊 postgres
       ├── 📁 Login/Group Roles
       └── ...
```

## ⚠️ Rappel Important

- **Ne remplissez PAS** le formulaire "Let's connect to the server"
- **Utilisez** le serveur PostgreSQL qui est déjà dans le panneau de gauche
- **Créez** la base de données en cliquant droit sur "Databases"


