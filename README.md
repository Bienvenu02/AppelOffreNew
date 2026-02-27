# 🚀 Projet Fullstack Laravel + Next.js + Tailwind CSS

## 📌 Présentation

Ce projet est une application **fullstack moderne** développée avec :

- **Laravel** (Backend – API REST)
- **Next.js** (Frontend)
- **Tailwind CSS** (Interface utilisateur)

Il constitue une base technique robuste, évolutive et maintenable, adaptée à des plateformes web professionnelles (SaaS, applications métiers, portails, etc.).

---

## 🎯 Objectifs

- Mettre en place une architecture fullstack moderne
- Assurer une séparation claire entre backend et frontend
- Garantir performance, sécurité et maintenabilité
- Fournir une base prête à évoluer vers un déploiement en production

---

## 🧱 Stack Technologique

| Domaine | Technologie |
|----------|-------------|
| Backend | Laravel |
| Frontend | Next.js |
| UI | Tailwind CSS |
| API | REST |
| Base de données | MySQL / PostgreSQL |
| Gestion des dépendances | Composer / npm |
| Environnement actuel | Local |

---

## 📂 Architecture du projet

```
project/
│
├── backend/   # API Laravel
└── frontend/  # Application Next.js
```

Cette structure garantit une séparation claire des responsabilités et facilite la scalabilité.

---

## ⚙️ Prérequis

- PHP ≥ 8.1  
- Composer  
- Node.js ≥ 18  
- npm ou yarn  
- MySQL ou PostgreSQL  
- Git  

---

# 🔧 Installation

## 1️⃣ Clonage

```bash
git clone https://github.com/username/project.git
cd project
```

---

# ⚙️ Backend – Laravel

## Installation

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurer la base de données dans le fichier `.env`.

---

## Migration de la base de données

```bash
php artisan migrate
```

---

## 🌱 Seed de la base de données

Après l’installation, il est recommandé de générer des données de test.

Avant d’exécuter le seed, modifier les identifiants (email, mot de passe, rôles…) dans :

```
backend/database/seeders/DatabaseSeeder.php
```

Exemple :

```php
User::create([
    'name' => 'Administrateur',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
]);
```

Ensuite exécuter :

```bash
php artisan db:seed
```

Ou bien :

```bash
php artisan migrate:fresh --seed
```

---

## Lancement du serveur backend

```bash
php artisan serve
```

Accessible sur :

```
http://127.0.0.1:8000
```

---

# 💻 Frontend – Next.js

## Installation

```bash
cd ../frontend
npm install
```

---

## 🎨 Configuration Tailwind CSS

Si nécessaire :

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Dans `globals.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Lancement du frontend

```bash
npm run dev
```

Accessible sur :

```
http://localhost:3000
```

---

# 🔗 Communication API

Le frontend communique avec Laravel via :

```
http://127.0.0.1:8000/api
```

Cette architecture permet :

- Une séparation claire des responsabilités
- Une meilleure sécurité
- Une évolutivité facilitée
- Une intégration possible avec des applications mobiles

---

# 🔐 Bonnes pratiques intégrées

- Architecture REST
- Séparation frontend / backend
- Structure modulaire
- Validation des données
- Gestion centralisée des erreurs
- Préparation pour authentification (Sanctum / JWT)

---

# 🚧 État du projet

Le projet est actuellement :

- En développement
- Testé en environnement local
- Prêt pour une phase de déploiement ultérieure

---

# 🚀 Perspectives d’évolution

- Authentification sécurisée
- Gestion des rôles et permissions
- Dashboard administratif
- Déploiement cloud (Vercel / VPS)
- Dockerisation
- CI/CD
- Monitoring

---

# 📈 Avantages

- Solution moderne et évolutive  
- Haute performance  
- Maintenance simplifiée  
- Sécurité renforcée  
- Architecture scalable  

---

# 📄 Licence

Licence MIT.
