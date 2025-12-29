# Guide d'intégration Frontend-Backend

Ce guide explique comment connecter votre application React Next.js au backend Django.

## 📋 Prérequis

- Backend Django en cours d'exécution sur `http://localhost:8000`
- Frontend Next.js en cours d'exécution sur `http://localhost:3000`

## 🔧 Configuration du Frontend

### 1. Créer le fichier `.env.local`

À la racine du projet React, créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Le fichier `lib/api.js` est déjà créé

Ce fichier contient toutes les fonctions nécessaires pour communiquer avec l'API Django.

## 🚀 Démarrage

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py init_data  # Optionnel : créer des données de test
python manage.py runserver
```

### Frontend

```bash
npm install
npm run dev
```

## 📝 Exemple d'utilisation dans le frontend

### Remplacer le localStorage par l'API

Au lieu d'utiliser `lib/storage.ts`, utilisez `lib/api.js` :

```javascript
// Avant (localStorage)
import { getProblems } from '@/lib/storage';
const problems = getProblems();

// Après (API)
import { getProblems } from '@/lib/api';
const problems = await getProblems();
```

### Exemple : Page des problèmes

```javascript
'use client'

import { useEffect, useState } from 'react';
import { getProblems } from '@/lib/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {problems.map(problem => (
        <div key={problem.id}>{problem.titre}</div>
      ))}
    </div>
  );
}
```

### Exemple : Authentification

```javascript
'use client'

import { useState } from 'react';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      // response.user contient les données de l'utilisateur
      console.log('Logged in:', response.user);
      // Rediriger ou mettre à jour l'état
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

## 🔄 Mapping des données

### Problèmes

```javascript
// Format API Django
{
  id: 1,
  titre: "Défaut de peinture",
  description: "...",
  date_declaration: "2025-01-20",
  declared_by: { id: 1, nom: "Ahmed", ... },
  declared_by_id: 1,  // Pour POST/PATCH
  status: "Ouvert",
  level: "Atelier",
  // ...
}

// Format React (ancien)
{
  problem_id: 1,
  titre: "Défaut de peinture",
  // ...
}
```

**Note** : L'API Django utilise `id` au lieu de `problem_id`. Vous devrez peut-être adapter votre code React pour utiliser `id` au lieu de `problem_id`.

### Utilisateurs

```javascript
// Format API Django
{
  id: 1,
  nom: "Ahmed Benali",
  role: "Manager",
  email: "ahmed@example.com",
  // ...
}

// Format React (ancien)
{
  user_id: 1,
  nom: "Ahmed Benali",
  // ...
}
```

## 🔐 Authentification

L'endpoint `/api/login/` retourne :

```json
{
  "user": {
    "id": 1,
    "nom": "Ahmed Benali",
    "role": "Manager",
    "email": "ahmed@example.com",
    ...
  },
  "message": "Login successful"
}
```

Stockez l'utilisateur dans votre contexte d'authentification.

## 📦 Endpoints disponibles

Voir `README_BACKEND.md` pour la liste complète des endpoints.

## 🐛 Dépannage

### Erreur CORS

Si vous voyez des erreurs CORS, vérifiez que :
- Le backend est bien configuré pour accepter les requêtes depuis `localhost:3000`
- Le middleware `corsheaders` est bien installé et configuré

### Erreur 404

Vérifiez que :
- L'URL de l'API est correcte dans `.env.local`
- Le backend est bien en cours d'exécution
- L'endpoint existe bien dans `backend/api/urls.py`

### Erreur de connexion à la base de données

Vérifiez que :
- Les informations de connexion Neon sont correctes dans `settings.py`
- La base de données existe bien
- Le SSL est bien configuré

## 📚 Ressources

- [Documentation Django REST Framework](https://www.django-rest-framework.org/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Neon](https://neon.tech/docs)

