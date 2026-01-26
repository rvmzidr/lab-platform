# 🔬 Lab Platform - Système de Gestion de Laboratoire CNSTN

## 📋 Table des Matières
- [Vue d'Ensemble](#vue-densemble)
- [Fonctionnalités Principales](#fonctionnalités-principales)
- [Stack Technologique](#stack-technologique)
- [Architecture du Projet](#architecture-du-projet)
- [Modules Principaux](#modules-principaux)
- [Installation et Démarrage](#installation-et-démarrage)
- [Documentation API](#documentation-api)
- [Workflow et Cycles de Vie](#workflow-et-cycles-de-vie)
- [Guide de Développement](#guide-de-développement)
- [Déploiement avec Docker](#déploiement-avec-docker)

## 🎯 Vue d'Ensemble

**Lab Platform** est une application web full-stack développée pour le **CNSTN (Centre National des Sciences et Technologies Nucléaires)** qui permet de gérer toutes les opérations d'un laboratoire de recherche moderne. Le système offre une solution complète et intégrée pour la gestion des utilisateurs, des projets de recherche, des demandes d'achat, des publications scientifiques et des informations institutionnelles.

### Contexte du Projet

Ce projet a été développé en plusieurs phases progressives (Day 1 à Day 6) pour construire une plateforme robuste et évolutive qui répond aux besoins spécifiques des laboratoires de recherche scientifique.

### Caractéristiques Principales

**Lab Platform** implémente un système de contrôle d'accès basé sur les rôles (RBAC) avec deux niveaux d'utilisateurs principaux :

- **👨‍🔬 Chef de Laboratoire (Admin)** : Contrôle total du système avec gestion des utilisateurs, approbation des comptes, création et supervision de projets, validation des demandes d'achat
- **👥 Membre de Laboratoire** : Consultation des projets, soumission de demandes d'achat, publication d'articles scientifiques

### Points Forts du Système

✅ **Workflow d'approbation complet** pour les nouveaux utilisateurs  
✅ **Gestion du cycle de vie** des demandes d'achat avec états multiples  
✅ **Authentification sécurisée** via JWT avec auto-refresh des tokens  
✅ **Architecture RESTful** avec séparation frontend/backend  
✅ **Base de données relationnelle** avec ORM Sequelize  
✅ **Interface responsive** développée avec Angular 17  
✅ **Dockerisé** pour un déploiement facile et portable

## ✨ Fonctionnalités Principales

### 🔐 Authentification et Gestion Avancée des Utilisateurs

#### Système d'Inscription et d'Approbation
- **Auto-inscription** : Les nouveaux utilisateurs s'inscrivent via un formulaire en ligne
- **Workflow d'approbation** : Chaque nouvel utilisateur est en état PENDING jusqu'à approbation par le Chef de Laboratoire
- **Gestion du cycle de vie** : PENDING → APPROVED → REJECTED → DISABLED
- **Authentification JWT** : Tokens sécurisés avec expiration et auto-refresh
- **Sécurité des mots de passe** : Hachage bcrypt avec salt rounds
- **Contrôle d'accès basé sur les rôles (RBAC)** : Deux niveaux de permissions (Admin et Membre)

#### Panel d'Administration Utilisateurs
- Interface complète de gestion des utilisateurs
- Approbation/rejet des nouvelles inscriptions avec justification
- Promotion/rétrogradation des rôles
- Désactivation temporaire des comptes
- Traçabilité : qui a approuvé quel utilisateur et quand
- Filtrage par statut et recherche par nom/email

### 🏢 Gestion des Institutions et Laboratoires

Le système permet de gérer l'organisation hiérarchique des institutions :
- **Informations complètes** : Nom, adresse, contact, description
- **Hiérarchie institutionnelle** : Relations entre institutions et laboratoires
- **Informations de laboratoire** : LabInfo avec coordonnées détaillées
- **Organisation en équipes** : Gestion des équipes de recherche (Teams)
- **Association avec projets** : Chaque projet appartient à une institution

### 🔬 Gestion des Projets de Recherche

Module complet pour suivre tous les projets de recherche :
- **Création et suivi** : Création par les admins uniquement
- **Informations détaillées** : Nom, source de financement, description, dates
- **Gestion budgétaire** : Budget total, suivi des dépenses via purchase requests
- **Assignation** : Chef de projet (Project Manager) assigné
- **Statut actif/inactif** : Archivage des projets terminés
- **Liaison institutionnelle** : Chaque projet est lié à une institution
- **Intégration** : Les demandes d'achat et articles sont liés aux projets

### 🛒 Système de Demandes d'Achat (Purchase Requests)

Workflow complet pour gérer les achats de matériel et équipements :

**Cycle de vie des demandes :**
```
DRAFT → PENDING → APPROVED → DELIVERED
                 ↓
              REJECTED
```

**Fonctionnalités :**
- Création de brouillons modifiables (DRAFT)
- Soumission pour approbation (PENDING)
- Approbation/rejet par le Chef de Laboratoire
- Marquage de livraison (DELIVERED)
- Calcul automatique du prix total (quantité × prix unitaire)
- Filtrage avancé par statut, projet, plage de dates
- Niveaux de priorité configurables
- Justification obligatoire en cas de rejet

**Contrôle d'accès :**
- Tous les utilisateurs peuvent créer des demandes
- Seuls les admins peuvent approuver, rejeter ou marquer comme livré
- Les demandes en DRAFT sont modifiables, les autres états sont verrouillés

### 📚 Référentiel d'Articles Scientifiques

Gestion complète des publications scientifiques du laboratoire :

**Informations gérées :**
- Titre, résumé (abstract), mots-clés
- Liste des auteurs
- Date de publication
- Journal/conférence de publication
- DOI (Digital Object Identifier)
- URL du PDF
- Statut de publication (draft, published, archived)
- Visibilité (public, members_only)

**Fonctionnalités :**
- Liaison avec projets de recherche
- Liaison avec équipes (teams)
- Attribution à l'auteur/soumetteur
- Filtrage par statut et visibilité
- Recherche par mots-clés

### 📊 Tableaux de Bord Personnalisés

**Tableau de bord Admin :**
- Vue d'ensemble du système
- Accès rapide à la gestion des utilisateurs
- Statistiques des projets et demandes
- Cartes de navigation vers toutes les fonctionnalités

**Tableau de bord Membre :**
- Vue limitée aux projets assignés
- Soumission de demandes d'achat
- Publication d'articles
- Profil utilisateur

### 🔍 Fonctionnalités Avancées

- **Recherche et filtrage en temps réel** sur toutes les entités
- **Validation des données** côté frontend et backend
- **Design responsive** : Compatible mobile, tablette et desktop
- **Synchronisation automatique** de la base de données avec Sequelize
- **Architecture RESTful** : API bien structurée
- **Support CORS** : Intégration frontend-backend sécurisée
- **Gestion des erreurs** : Messages d'erreur clairs et cohérents

## 🛠️ Stack Technologique

### Backend (Node.js + Express)

| Technologie | Version | Description |
|------------|---------|-------------|
| **Node.js** | Dernière LTS | Runtime JavaScript côté serveur |
| **Express.js** | 4.18.2 | Framework web minimaliste et flexible |
| **MySQL** | 8.0+ | Base de données relationnelle |
| **Sequelize** | 6.35.0 | ORM (Object-Relational Mapping) pour MySQL |
| **JWT** | jsonwebtoken 9.0.2 | Authentification par tokens sécurisés |
| **bcryptjs** | 2.4.3 | Hachage sécurisé des mots de passe |
| **cors** | 2.8.5 | Middleware pour Cross-Origin Resource Sharing |
| **dotenv** | 16.3.1 | Gestion des variables d'environnement |
| **mysql2** | 3.6.5 | Driver MySQL pour Node.js |
| **nodemon** | 3.0.2 | Auto-redémarrage en développement |

### Frontend (Angular)

| Technologie | Version | Description |
|------------|---------|-------------|
| **Angular** | 17.0.0 | Framework frontend TypeScript |
| **TypeScript** | 5.2.2 | Superset JavaScript typé |
| **RxJS** | 7.8.0 | Programmation réactive |
| **Angular Router** | 17.0.0 | Routing et navigation |
| **Angular Forms** | 17.0.0 | Gestion des formulaires |
| **Angular HttpClient** | 17.0.0 | Communication HTTP |
| **Jasmine** | 5.1.0 | Framework de tests |
| **Karma** | 6.4.0 | Test runner |

### Infrastructure

| Composant | Description |
|-----------|-------------|
| **Docker** | Conteneurisation de l'application (MySQL, Backend, Frontend) |
| **Docker Compose** | Orchestration des conteneurs |
| **Images Docker** | Disponibles sur Docker Hub (ramzi85/lab-platform-*) |

### Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT                     │
│                  (Angular 17 - Port 4200)                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ Requêtes API REST
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Express - Port 3000)           │
│  ┌─────────────┬──────────────┬────────────────────┐   │
│  │  Routes     │ Controllers  │   Middlewares      │   │
│  │  (/api/*)   │              │ (JWT, isAdmin)     │   │
│  └─────────────┴──────────────┴────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────┐       │
│  │         Models (Sequelize ORM)              │       │
│  │  User | Project | PurchaseRequest | Article │       │
│  └──────────────────────┬──────────────────────┘       │
└─────────────────────────┼────────────────────────────────┘
                          │ SQL Queries
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BASE DE DONNÉES MySQL 8.0+                  │
│     Tables: users, projects, institutions,               │
│     purchase_requests, articles, teams, lab_info         │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture du Projet

### Structure Backend

```
backend/
├── config/
│   ├── auth.config.js          # Configuration JWT (secret, expiration)
│   └── database.js             # Connexion Sequelize à MySQL
│
├── controllers/                # Logique métier et gestion des requêtes
│   ├── admin.controller.js     # Gestion utilisateurs (approve, reject, disable)
│   ├── article.controller.js   # CRUD articles scientifiques
│   ├── auth.controller.js      # Inscription, connexion, validation tokens
│   ├── institution.controller.js # CRUD institutions
│   ├── project.controller.js   # CRUD projets de recherche
│   ├── public.controller.js    # API publique (lab-info, teams)
│   ├── purchaseRequest.controller.js # Workflow demandes d'achat
│   └── test.controller.js      # Endpoints de test
│
├── middlewares/                # Middlewares Express
│   ├── verifyToken.js          # Vérification JWT pour routes protégées
│   ├── isAdmin.js              # Vérification rôle admin
│   └── index.js                # Export des middlewares
│
├── models/                     # Modèles Sequelize (ORM)
│   ├── User.js                 # Utilisateurs (firstName, lastName, email, role, status)
│   ├── Institution.js          # Institutions de recherche
│   ├── LabInfo.js              # Informations du laboratoire
│   ├── Project.js              # Projets (name, budget, startDate, endDate)
│   ├── PurchaseRequest.js      # Demandes d'achat (itemName, quantity, status)
│   ├── Article.js              # Articles scientifiques (title, doi, authors)
│   ├── Team.js                 # Équipes de recherche
│   └── index.js                # Associations entre modèles
│
├── routes/                     # Définition des routes API
│   ├── auth.routes.js          # POST /api/auth/signup, /signin
│   ├── admin.routes.js         # GET/PATCH /api/admin/users/*
│   ├── article.routes.js       # CRUD /api/articles/*
│   ├── institution.routes.js   # CRUD /api/institutions/*
│   ├── project.routes.js       # CRUD /api/projects/*
│   ├── purchaseRequest.routes.js # CRUD + workflow /api/purchase-requests/*
│   ├── public.routes.js        # GET /api/public/lab-info, /teams
│   └── test.routes.js          # GET /api/test/public, /protected, /admin
│
├── migrations/                 # Scripts SQL de migration
│   ├── day2-business-models.sql           # Institutions, projets, purchase requests
│   ├── day3-user-approval-system.sql      # Système d'approbation utilisateurs
│   ├── day6-articles-COMPLET-FINAL.sql    # Module articles scientifiques
│   └── fix-timestamps.sql                  # Corrections timestamps
│
├── server.js                   # Point d'entrée : app Express, sync DB, seeding admin
├── reset-admin.js              # Utilitaire réinitialisation mot de passe admin
├── Dockerfile                  # Image Docker backend
└── package.json                # Dépendances Node.js
```

### Structure Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/         # Composants Angular
│   │   │   ├── about/          # Page À propos
│   │   │   ├── admin-users/    # Gestion utilisateurs (admin)
│   │   │   ├── articles/       # Gestion articles scientifiques
│   │   │   ├── contact/        # Page Contact
│   │   │   ├── dashboard/      # Tableau de bord basé sur rôle
│   │   │   ├── footer/         # Pied de page
│   │   │   ├── header/         # En-tête navigation
│   │   │   ├── home/           # Page d'accueil
│   │   │   ├── login/          # Formulaire de connexion
│   │   │   ├── projects/       # Gestion projets
│   │   │   ├── purchase-requests/ # Gestion demandes d'achat
│   │   │   ├── register/       # Formulaire d'inscription
│   │   │   ├── sidebar/        # Barre latérale navigation
│   │   │   └── welcome/        # Page d'accueil visiteurs
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts   # Protection des routes (canActivate)
│   │   │
│   │   ├── services/           # Services Angular (HTTP)
│   │   │   ├── admin.service.ts    # Appels API admin
│   │   │   ├── article.service.ts  # Appels API articles
│   │   │   ├── auth.service.ts     # Authentification, login, logout
│   │   │   ├── auth.interceptor.ts # Intercepteur HTTP (ajout token JWT)
│   │   │   ├── institution.service.ts # Appels API institutions
│   │   │   ├── project.service.ts  # Appels API projets
│   │   │   ├── public.service.ts   # Appels API publics
│   │   │   └── purchase-request.service.ts # Appels API demandes
│   │   │
│   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── user.model.ts
│   │   │   ├── article.model.ts
│   │   │   ├── institution.model.ts
│   │   │   ├── lab-info.model.ts
│   │   │   ├── project.model.ts
│   │   │   └── purchase-request.model.ts
│   │   │
│   │   ├── app-routing.module.ts   # Configuration des routes
│   │   ├── app.component.ts        # Composant racine
│   │   └── app.module.ts           # Module principal
│   │
│   ├── assets/
│   │   └── images/             # Images statiques
│   │
│   ├── environments/
│   │   └── environment.ts      # Configuration environnement
│   │
│   ├── index.html              # Point d'entrée HTML
│   ├── main.ts                 # Bootstrap Angular
│   └── styles.css              # Styles globaux
│
├── angular.json                # Configuration Angular CLI
├── tsconfig.json               # Configuration TypeScript
├── Dockerfile                  # Image Docker frontend
└── package.json                # Dépendances npm
```

### Modèles de Données et Relations

```
┌─────────────┐
│    User     │ 1──────────────────┐
│-------------|                    │
│ id (PK)     │                    │ Approves
│ firstName   │                    │
│ lastName    │                    ▼
│ email       │              ┌──────────┐
│ password    │              │   User   │
│ role        │◄─────────────│(approved)│
│ status      │  approvedById└──────────┘
│ approvedById│
└─────────────┘
      │ 1
      │ Creates/Manages
      │
      ├────────────┬──────────────┬────────────┐
      │            │              │            │
      ▼ *         ▼ *            ▼ *          ▼ *
┌──────────┐  ┌─────────┐  ┌─────────────┐ ┌──────────┐
│ Project  │  │Purchase │  │   Article   │ │   Team   │
│          │  │Request  │  │             │ │          │
└──────────┘  └─────────┘  └─────────────┘ └──────────┘
      ▲              ▲           ▲
      │              │           │
      │ *            │ *         │ *
┌─────────────┐     │           │
│Institution  │     │           │
│             │─────┘           │
└─────────────┘                 │
      ▲                         │
      │                         │
      │ 1                       │ *
┌─────────────┐                 │
│   LabInfo   │─────────────────┘
└─────────────┘

Légende:
1 : Un
* : Plusieurs
```

## 🔧 Modules Principaux

### 1. 🔐 Module d'Authentification

**Responsabilités :**
- Inscription des nouveaux utilisateurs avec workflow d'approbation
- Connexion sécurisée avec génération de JWT
- Validation et rafraîchissement des tokens
- Hashage sécurisé des mots de passe (bcrypt)
- Gestion des sessions utilisateur

**Endpoints API :**
- `POST /api/auth/signup` - Inscription (crée utilisateur en statut PENDING)
- `POST /api/auth/signin` - Connexion (vérifie status APPROVED)

**Sécurité :**
- Mots de passe hashés avec bcrypt (10 salt rounds)
- Tokens JWT avec expiration configurable (défaut 24h)
- Validation côté serveur des données d'inscription

### 2. 👥 Module de Gestion des Utilisateurs

**Responsabilités :**
- Approbation/rejet des nouvelles inscriptions
- Modification des rôles utilisateur
- Gestion du cycle de vie des comptes (enable/disable)
- Traçabilité des approbations
- Profils utilisateurs

**Endpoints API :**
- `GET /api/admin/users` - Liste tous les utilisateurs (avec filtre ?status=)
- `GET /api/admin/users/:id` - Détails d'un utilisateur
- `PATCH /api/admin/users/:id/approve` - Approuver utilisateur PENDING
- `PATCH /api/admin/users/:id/reject` - Rejeter avec raison
- `PATCH /api/admin/users/:id/disable` - Désactiver compte
- `PATCH /api/admin/users/:id/enable` - Réactiver compte
- `PATCH /api/admin/users/:id/promote` - Changer le rôle

**Workflow :**
```
Inscription → PENDING (en attente)
                 ↓
           [Admin Review]
                 ↓
         ┌───────┴───────┐
         ▼               ▼
    APPROVED         REJECTED
         │               │
         └──→ (DISABLED) │
                         │
    (peut être ré-approuvé)
```

### 3. 🏢 Module de Gestion des Institutions

**Responsabilités :**
- CRUD complet des institutions
- Gestion des informations de laboratoire (LabInfo)
- Organisation hiérarchique
- Association avec les projets

**Endpoints API :**
- `GET /api/institutions` - Liste toutes les institutions
- `POST /api/institutions` - Créer une institution (Admin uniquement)
- `PUT /api/institutions/:id` - Modifier (Admin uniquement)
- `DELETE /api/institutions/:id` - Supprimer (Admin uniquement)

### 4. 🔬 Module de Gestion des Projets

**Responsabilités :**
- Création et suivi des projets de recherche
- Allocation budgétaire
- Assignation de chef de projet
- Gestion des dates et du statut actif
- Liaison avec institution parente

**Endpoints API :**
- `GET /api/projects` - Liste tous les projets
- `GET /api/projects/:id` - Détails d'un projet
- `POST /api/projects` - Créer projet (Admin uniquement)
- `PUT /api/projects/:id` - Modifier projet (Admin uniquement)
- `DELETE /api/projects/:id` - Supprimer projet (Admin uniquement)

**Modèle de données :**
```javascript
{
  id: Integer,
  name: String (255),
  source: String (255),        // Source de financement
  description: Text,
  startDate: Date,
  endDate: Date,
  budget: Decimal (15,2),
  institutionId: Foreign Key,
  projectManagerId: Foreign Key,
  isActive: Boolean
}
```

### 5. 🛒 Module de Demandes d'Achat

**Responsabilités :**
- Création et soumission de demandes
- Workflow d'approbation multi-étapes
- Suivi du statut des demandes
- Calcul automatique des totaux
- Confirmation de livraison

**Endpoints API :**
- `GET /api/purchase-requests` - Liste avec filtres (status, project, dates)
- `POST /api/purchase-requests` - Créer demande (tous utilisateurs)
- `PUT /api/purchase-requests/:id` - Modifier (si DRAFT uniquement)
- `POST /api/purchase-requests/:id/submit` - Soumettre (DRAFT → PENDING)
- `POST /api/purchase-requests/:id/approve` - Approuver (Admin, PENDING → APPROVED)
- `POST /api/purchase-requests/:id/reject` - Rejeter avec raison (Admin)
- `POST /api/purchase-requests/:id/deliver` - Marquer livré (Admin, APPROVED → DELIVERED)
- `DELETE /api/purchase-requests/:id` - Supprimer (Admin uniquement)

**États possibles :**
- **DRAFT** : Brouillon modifiable
- **PENDING** : En attente d'approbation
- **APPROVED** : Approuvé, prêt pour achat
- **REJECTED** : Rejeté (état terminal)
- **DELIVERED** : Livré (état terminal)

### 6. 📚 Module d'Articles Scientifiques

**Responsabilités :**
- Publication d'articles scientifiques
- Gestion DOI et liens PDF
- Suivi du statut de publication
- Contrôle de visibilité (public/members only)
- Attribution aux auteurs et projets

**Endpoints API :**
- `GET /api/articles/public` - Articles publics (pas d'auth requise)
- `GET /api/articles` - Tous les articles (membres uniquement)
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Publier article
- `PUT /api/articles/:id` - Modifier article
- `DELETE /api/articles/:id` - Supprimer article

**Modèle de données :**
```javascript
{
  id: Integer,
  title: String (500),
  abstract: Text,
  authors: String (500),
  keywords: String (500),
  publicationDate: Date,
  journal: String (255),
  doi: String (100),           // Unique
  pdfUrl: String (500),
  status: ENUM (draft, published, archived),
  visibility: ENUM (public, members_only),
  userId: Foreign Key,         // Auteur
  projectId: Foreign Key,      // Projet associé
  teamId: Foreign Key          // Équipe associée
}
```


## 🚀 Installation et Démarrage

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

| Logiciel | Version | Lien de téléchargement |
|----------|---------|------------------------|
| **Node.js** | 16.x ou supérieur | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0 ou supérieur | [MySQL Downloads](https://dev.mysql.com/downloads/) |
| **Angular CLI** | 17.x | `npm install -g @angular/cli` |
| **Git** | Dernière version | [git-scm.com](https://git-scm.com/) |

### Installation Manuelle (Développement)

#### 1. Cloner le Dépôt

```bash
git clone <repository-url>
cd lab-platform
```

#### 2. Configuration Backend

**a. Naviguer vers le dossier backend**
```bash
cd backend
```

**b. Installer les dépendances**
```bash
npm install
```

**c. Configurer les variables d'environnement**

Créer un fichier `.env` dans le dossier `backend/` :

```env
# Configuration Base de Données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=lab_platform

# Configuration JWT
JWT_SECRET=votre-cle-secrete-jwt-changez-en-production
JWT_EXPIRATION=86400

# Configuration Serveur
PORT=3000
NODE_ENV=development
```

⚠️ **Important** : Changez `JWT_SECRET` en production avec une clé forte et aléatoire.

**d. Créer la base de données MySQL**

Connectez-vous à MySQL et exécutez :

```sql
CREATE DATABASE lab_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**e. Migrations de base de données (Optionnel)**

Le serveur va automatiquement synchroniser le schéma au démarrage, mais vous pouvez exécuter manuellement les migrations :

```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la base de données
USE lab_platform;

# Exécuter les migrations dans l'ordre
SOURCE migrations/day2-business-models.sql;
SOURCE migrations/day3-user-approval-system-SAFE.sql;
SOURCE migrations/day6-articles-COMPLET-FINAL.sql;
```

**f. Démarrer le serveur backend**

```bash
# Mode production
npm start

# Mode développement (avec auto-reload)
npm run dev
```

✅ Le backend API sera accessible sur **http://localhost:3000**

**Vérification :**
```bash
curl http://localhost:3000
# Devrait retourner un JSON avec les endpoints disponibles
```

**Compte Admin par défaut :**
- 📧 Email: `admin@lab.com`
- 🔑 Mot de passe: `admin123`
- 👤 Rôle: `admin` (Chef de Laboratoire)
- ✅ Statut: `APPROVED`

🔒 **IMPORTANT** : Changez immédiatement le mot de passe admin après la première connexion !

#### 3. Configuration Frontend

**a. Ouvrir un nouveau terminal et naviguer vers frontend**
```bash
cd frontend
```

**b. Installer les dépendances**
```bash
npm install
```

**c. Configurer l'endpoint API (si nécessaire)**

Par défaut, l'API backend est configurée sur `http://localhost:3000`. Si vous devez changer cet endpoint, modifiez les services dans `src/app/services/`.

Exemple dans `auth.service.ts` :
```typescript
private API_URL = 'http://localhost:3000/api/auth';
```

**d. Démarrer le serveur de développement Angular**

```bash
# Démarrage standard
npm start

# Ou avec ng serve
ng serve

# Ouvrir automatiquement dans le navigateur
ng serve --open
```

✅ Le frontend sera accessible sur **http://localhost:4200**

#### 4. Accéder à l'Application

1. Ouvrez votre navigateur et allez sur **http://localhost:4200**
2. Vous verrez la page d'accueil avec deux options :
   - **Lab Head Login** : Connexion admin
   - **Register** : Inscription nouveau utilisateur
3. Connectez-vous avec les identifiants admin par défaut
4. Ou créez un nouveau compte (nécessitera l'approbation admin)

### Installation avec Docker (Production)

#### Prérequis Docker
- Docker Desktop installé
- Docker Compose disponible

#### Configuration

**1. Créer un fichier `.env` à la racine du projet :**

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=root_password_secure
MYSQL_DATABASE=lab_platform
MYSQL_USER=lab_user
MYSQL_PASSWORD=lab_password_secure

# Backend Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USER=lab_user
DB_PASSWORD=lab_password_secure
DB_NAME=lab_platform

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=86400

BACKEND_PORT=3000
NODE_ENV=production

# Frontend Configuration
FRONTEND_PORT=4200
```

**2. Lancer avec Docker Compose :**

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

**3. Accéder à l'application :**
- Frontend : http://localhost:4200
- Backend API : http://localhost:3000

**4. Services Docker démarrés :**
- `mysql-db` : Base de données MySQL 8.0
- `lab-backend` : API Node.js/Express
- `lab-frontend` : Application Angular

### Premiers Pas

#### Configuration Initiale (Admin)

1. **Connexion Admin**
   - Email : `admin@lab.com`
   - Mot de passe : `admin123`

2. **Changer le mot de passe admin** (recommandé)
   - Aller dans Profil → Changer mot de passe

3. **Créer une Institution**
   - Menu : Institutions → Créer
   - Remplir : nom, adresse, contact

4. **Approuver des utilisateurs**
   - Menu : Gestion Utilisateurs
   - Voir les utilisateurs en statut PENDING
   - Approuver ou rejeter les inscriptions

5. **Créer un projet de recherche**
   - Menu : Projets → Nouveau Projet
   - Associer à une institution
   - Définir budget et dates

#### Test du Système

**Tester le workflow complet :**

1. **Créer un utilisateur membre**
   - Se déconnecter
   - Cliquer sur "Register"
   - Remplir le formulaire

2. **Approuver le nouveau membre (en tant qu'admin)**
   - Se reconnecter en admin
   - Gestion Utilisateurs → Approuver

3. **Créer une demande d'achat (en tant que membre)**
   - Se reconnecter avec le nouveau compte
   - Demandes d'Achat → Créer
   - Soumettre pour approbation

4. **Approuver la demande (en tant qu'admin)**
   - Se reconnecter en admin
   - Demandes d'Achat → Approuver

5. **Publier un article scientifique**
   - Menu : Articles → Nouveau
   - Remplir les informations
   - Choisir visibilité

### Dépannage

**Backend ne démarre pas :**
- Vérifier que MySQL est démarré
- Vérifier les credentials dans `.env`
- Vérifier que le port 3000 n'est pas occupé

**Frontend ne se connecte pas au backend :**
- Vérifier que le backend est démarré sur port 3000
- Vérifier CORS activé dans backend
- Vérifier l'URL de l'API dans les services Angular

**Erreur de base de données :**
- Vérifier que la database `lab_platform` existe
- Exécuter les migrations manuellement
- Vérifier les permissions de l'utilisateur MySQL

**Problème de connexion :**
- Vérifier que l'utilisateur existe et est APPROVED
- Vérifier le token JWT dans le localStorage du navigateur
- Effacer le cache du navigateur

## 📡 Documentation API

### Endpoints d'Authentification

#### 📝 Inscription d'un Nouvel Utilisateur

```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "nationalId": "AB123456",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "member"
}

Réponse: 201 Created
{
  "message": "User registered successfully! Awaiting admin approval.",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "status": "PENDING"
  }
}
```

**Notes :**
- Le statut initial est toujours `PENDING`
- Le rôle `admin` ne peut pas être attribué lors de l'inscription
- L'utilisateur ne peut pas se connecter tant qu'il n'est pas `APPROVED`

#### 🔓 Connexion

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@lab.com",
  "password": "admin123"
}

Réponse: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@lab.com",
    "role": "admin",
    "status": "APPROVED",
    "firstName": "Lab",
    "lastName": "Administrator"
  }
}
```

**Erreurs possibles :**
- `401` : Email ou mot de passe incorrect
- `403` : Compte non approuvé (PENDING, REJECTED, ou DISABLED)

### Endpoints de Gestion des Utilisateurs (Admin)

Tous ces endpoints nécessitent :
- Header `Authorization: Bearer <token>`
- Rôle `admin`

#### 📋 Liste des Utilisateurs

```http
GET /api/admin/users
GET /api/admin/users?status=PENDING    # Filtrer par statut

Réponse: 200 OK
{
  "users": [
    {
      "id": 2,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "member",
      "status": "PENDING",
      "createdAt": "2026-01-20T10:30:00Z"
    }
  ]
}
```

#### ✅ Approuver un Utilisateur

```http
PATCH /api/admin/users/2/approve

Réponse: 200 OK
{
  "message": "User approved successfully",
  "user": {
    "id": 2,
    "status": "APPROVED",
    "approvedById": 1,
    "approvedAt": "2026-01-26T14:22:00Z"
  }
}
```

#### ❌ Rejeter un Utilisateur

```http
PATCH /api/admin/users/2/reject
Content-Type: application/json

{
  "reason": "Informations incomplètes ou non vérifiées"
}

Réponse: 200 OK
{
  "message": "User rejected",
  "user": {
    "id": 2,
    "status": "REJECTED",
    "rejectionReason": "Informations incomplètes ou non vérifiées"
  }
}
```

#### 🔒 Désactiver un Utilisateur

```http
PATCH /api/admin/users/2/disable

Réponse: 200 OK
{
  "message": "User disabled successfully",
  "user": { "id": 2, "status": "DISABLED" }
}
```

#### 🔓 Réactiver un Utilisateur

```http
PATCH /api/admin/users/2/enable

Réponse: 200 OK
{
  "message": "User enabled successfully",
  "user": { "id": 2, "status": "APPROVED" }
}
```

#### 👑 Promouvoir/Changer le Rôle

```http
PATCH /api/admin/users/2/promote
Content-Type: application/json

{
  "role": "admin"
}

Réponse: 200 OK
{
  "message": "User role updated",
  "user": { "id": 2, "role": "admin" }
}
```

### Endpoints Institutions

#### 📋 Liste des Institutions

```http
GET /api/institutions

Réponse: 200 OK
{
  "institutions": [
    {
      "id": 1,
      "name": "CNSTN Research Center",
      "address": "Tunis, Tunisia",
      "contact": "contact@cnstn.rnrt.tn",
      "createdAt": "2026-01-15T08:00:00Z"
    }
  ]
}
```

#### ➕ Créer une Institution (Admin uniquement)

```http
POST /api/institutions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CNSTN Research Center",
  "address": "Tunis, Tunisia",
  "contact": "contact@cnstn.rnrt.tn",
  "description": "Centre National des Sciences et Technologies Nucléaires"
}

Réponse: 201 Created
```

### Endpoints Projets

#### 📋 Liste des Projets

```http
GET /api/projects
GET /api/projects?institutionId=1
GET /api/projects?isActive=true

Réponse: 200 OK
{
  "projects": [
    {
      "id": 1,
      "name": "Nuclear Safety Research",
      "source": "EU Grant 2024",
      "budget": 150000.00,
      "startDate": "2024-01-01",
      "endDate": "2026-12-31",
      "isActive": true,
      "institution": { "id": 1, "name": "CNSTN" },
      "projectManager": { "id": 2, "firstName": "John", "lastName": "Doe" }
    }
  ]
}
```

#### ➕ Créer un Projet (Admin uniquement)

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuclear Safety Research",
  "source": "EU Grant 2024",
  "description": "Advanced nuclear safety protocols",
  "startDate": "2024-01-01",
  "endDate": "2026-12-31",
  "budget": 150000.00,
  "institutionId": 1,
  "projectManagerId": 2
}

Réponse: 201 Created
```

### Endpoints Demandes d'Achat

#### 📋 Liste des Demandes

```http
GET /api/purchase-requests
GET /api/purchase-requests?status=PENDING
GET /api/purchase-requests?projectId=1
GET /api/purchase-requests?startDate=2026-01-01&endDate=2026-01-31

Réponse: 200 OK
{
  "purchaseRequests": [
    {
      "id": 1,
      "itemName": "Microscope électronique",
      "quantity": 1,
      "estimatedPrice": 25000.00,
      "totalPrice": 25000.00,
      "status": "PENDING",
      "project": { "id": 1, "name": "Nuclear Safety Research" },
      "requester": { "id": 2, "firstName": "John" }
    }
  ]
}
```

#### ➕ Créer une Demande (Tous utilisateurs authentifiés)

```http
POST /api/purchase-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemName": "Microscope électronique",
  "description": "Pour analyse structurelle",
  "quantity": 1,
  "estimatedPrice": 25000.00,
  "projectId": 1
}

Réponse: 201 Created
{
  "id": 1,
  "status": "DRAFT",
  "totalPrice": 25000.00
}
```

#### 📤 Soumettre pour Approbation

```http
POST /api/purchase-requests/1/submit
Authorization: Bearer <token>

Réponse: 200 OK
{
  "message": "Purchase request submitted for approval",
  "purchaseRequest": { "id": 1, "status": "PENDING" }
}
```

#### ✅ Approuver une Demande (Admin uniquement)

```http
POST /api/purchase-requests/1/approve
Authorization: Bearer <token>

Réponse: 200 OK
{
  "message": "Purchase request approved",
  "purchaseRequest": { "id": 1, "status": "APPROVED" }
}
```

#### ❌ Rejeter une Demande (Admin uniquement)

```http
POST /api/purchase-requests/1/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Budget insuffisant pour ce trimestre"
}

Réponse: 200 OK
{
  "message": "Purchase request rejected",
  "purchaseRequest": {
    "id": 1,
    "status": "REJECTED",
    "rejectionReason": "Budget insuffisant pour ce trimestre"
  }
}
```

#### 📦 Marquer comme Livré (Admin uniquement)

```http
POST /api/purchase-requests/1/deliver
Authorization: Bearer <token>

Réponse: 200 OK
{
  "message": "Purchase request marked as delivered",
  "purchaseRequest": { "id": 1, "status": "DELIVERED" }
}
```

### Endpoints Articles Scientifiques

#### 📋 Articles Publics (Pas d'authentification requise)

```http
GET /api/articles/public

Réponse: 200 OK
{
  "articles": [
    {
      "id": 1,
      "title": "Advanced Nuclear Safety Protocols",
      "authors": "John Doe, Jane Smith",
      "abstract": "This paper presents...",
      "publicationDate": "2025-12-01",
      "journal": "Nuclear Science Journal",
      "doi": "10.1234/nsj.2025.001",
      "visibility": "public"
    }
  ]
}
```

#### 📋 Tous les Articles (Membres uniquement)

```http
GET /api/articles
Authorization: Bearer <token>

Réponse: 200 OK
{
  "articles": [...]
}
```

#### ➕ Publier un Article

```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced Nuclear Safety Protocols",
  "abstract": "This paper presents innovative approaches...",
  "authors": "John Doe, Jane Smith",
  "keywords": "nuclear, safety, protocols",
  "publicationDate": "2025-12-01",
  "journal": "Nuclear Science Journal",
  "doi": "10.1234/nsj.2025.001",
  "pdfUrl": "https://journal.com/papers/001.pdf",
  "status": "published",
  "visibility": "public",
  "projectId": 1,
  "teamId": 1
}

Réponse: 201 Created
```

### Endpoints de Test

#### 🌐 Endpoint Public

```http
GET /api/test/public

Réponse: 200 OK
{
  "message": "Public endpoint - no authentication required"
}
```

#### 🔒 Endpoint Protégé

```http
GET /api/test/protected
Authorization: Bearer <token>

Réponse: 200 OK
{
  "message": "Protected endpoint - authentication required",
  "user": { "id": 1, "email": "admin@lab.com" }
}
```

#### 👑 Endpoint Admin

```http
GET /api/test/admin
Authorization: Bearer <token>

Réponse: 200 OK
{
  "message": "Admin endpoint - admin role required",
  "user": { "id": 1, "role": "admin" }
}
```

### Codes de Réponse HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **400** | Bad Request | Données invalides |
| **401** | Unauthorized | Authentification requise ou échec |
| **403** | Forbidden | Permissions insuffisantes |
| **404** | Not Found | Ressource non trouvée |
| **500** | Internal Server Error | Erreur serveur |

### Authentification JWT

Toutes les routes protégées nécessitent un header d'autorisation :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Le token est retourné lors de la connexion et doit être inclus dans chaque requête protégée.

{
  "email": "admin@lab.com",
  "password": "admin123"
}

Response: 200 OK
{
  "id": 1,
  "email": "admin@lab.com",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Admin Endpoints (Protected - Admin Only)

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member",
    "status": "PENDING",
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
]
```

#### Approve User
```http
PUT /api/admin/users/:id/approve
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "User approved successfully",
  "user": { "id": 1, "status": "APPROVED" }
}
```

#### Reject User
```http
PUT /api/admin/users/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "rejectionReason": "Incomplete information"
}

Response: 200 OK
{
  "message": "User rejected",
  "user": { "id": 1, "status": "REJECTED" }
}
```

#### Change User Role
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "member"  // "admin" or "member"
}

Response: 200 OK
{
  "message": "User role updated",
  "user": { "id": 1, "role": "member" }
}
```

### Project Endpoints

#### Create Project (Lab Head Only)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "AI Research Initiative",
  "description": "Advanced machine learning research",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "budget": 50000,
  "status": "ACTIVE",
  "institutionId": 1
}

Response: 201 Created
```

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>

Response: 200 OK
[...]
```

### Purchase Request Endpoints

#### Create Purchase Request
```http
POST /api/purchase-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemName": "Laboratory Equipment",
  "description": "Microscope for research",
  "quantity": 1,
  "estimatedPrice": 5000,
  "priority": "HIGH",
  "status": "DRAFT",
  "projectId": 1
}

Response: 201 Created
```

#### Update Purchase Request Status
```http
PUT /api/purchase-requests/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}

Response: 200 OK
```

### Article Endpoints

#### Create Article
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Novel Approach to Quantum Computing",
  "abstract": "This paper presents...",
  "authors": "John Doe, Jane Smith",
  "keywords": "quantum, computing, algorithms",
  "publicationDate": "2026-01-15",
  "journal": "Nature",
  "doi": "10.1234/nature.2026.001",
  "status": "PUBLISHED",
  "visibility": "PUBLIC",
  "projectId": 1
}

Response: 201 Created
```

#### Get Public Articles
```http
GET /api/articles/public

Response: 200 OK
[...]
```

### Public Endpoints (No Authentication Required)

#### Get Laboratory Information
```http
GET /api/public/lab-info

Response: 200 OK
{
  "name": "Advanced Research Laboratory",
  "description": "Leading research in AI and quantum computing",
  "address": "123 Science Park",
  "phone": "+1234567890",
  "email": "info@lab.com"
}
```

## 🔄 Development Timeline

### Phase 1 - Foundation (Day 1)
- ✅ Project setup and structure
- ✅ Basic authentication system
- ✅ JWT token implementation
- ✅ User model with roles
- ✅ Login/logout functionality

### Phase 2 - Business Domain (Day 2)
- ✅ Institution management
- ✅ Project management
- ✅ Purchase request workflow
- ✅ Database relationships
- ✅ CRUD operations for all entities

### Phase 3 - User Management (Day 3)
- ✅ User registration system
- ✅ Approval workflow
- ✅ Admin panel
- ✅ Role-based dashboards
- ✅ User status lifecycle

### Phase 4 - Scientific Content (Day 6)
- ✅ Article management system
- ✅ Publication workflow
- ✅ DOI and citation tracking
- ✅ Visibility control
- ✅ Author attribution

### Future Enhancements
- 📅 Calendar integration for project timelines
- 📊 Advanced analytics and reporting
- 📧 Email notifications for approvals
- 🔔 Real-time notifications
- 📎 File upload and document management
- 🌐 Multi-language support
- 📱 Mobile application
- 🔍 Advanced search with Elasticsearch
- 📈 Data visualization dashboards
- 🤝 Collaboration tools

## 📸 Screenshots

### Welcome Landing Page
The entry point showing "Lab Head Login" and "Register" options for new users.

### Login Page
Secure authentication with email and password, featuring form validation and error handling.

### Registration Page
Self-registration form with approval workflow notification for new users.

### Admin Dashboard
Comprehensive overview with user management, statistics, and quick access cards.

### User Management Panel
Complete user approval interface showing pending, approved, and rejected users with action buttons.

### Projects Dashboard
List of all research projects with create, edit, and delete capabilities.

### Purchase Requests
Full lifecycle management interface with status filters and approval workflows.

### Articles Repository
Scientific article management with publication status and visibility controls.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- **CNSTN Lab Team** - Initial development

## 🙏 Acknowledgments

- Built with Angular and Node.js
- Database powered by MySQL
- Authentication using JWT
- UI inspiration from modern laboratory management systems

## 📞 Support

For support, please contact:
- Email: support@lab-platform.com
- Issues: Create an issue on GitHub
- Documentation: See project wiki

---

**Version**: 1.0.0  
**Last Updated**: January 16, 2026  
**Status**: Active Development


   - **IMPORTANT**: Run migration scripts in order:
     1. Start backend server once (creates Day 1 tables)
     2. Run `backend/migrations/day2-business-models.sql` in Laragon/MySQL
     3. If you get timestamp errors, run `backend/migrations/fix-timestamps.sql`
     4. Run `backend/migrations/day3-user-approval-system.sql` ✨ NEW!

3. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs on: http://localhost:3000

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   Application runs on: http://localhost:4200

## Default Admin Account

- **Email:** admin@lab.com
- **Password:** admin123
- **Role:** admin (LabHead)
- **Status:** APPROVED ✨ (Day 3)

## Available API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration (creates PENDING user)
- `POST /api/auth/signin` - User login (checks status)

### Test Endpoints
- `GET /api/test/public` - Public content (no authentication)
- `GET /api/test/protected` - Protected content (requires valid token)
- `GET /api/test/admin` - Admin-only content (requires admin role)

### Admin - User Management ✨ NEW! (Day 3)
- `GET /api/admin/users` - Get all users (optional ?status= filter)
- `GET /api/admin/users/:id` - Get user by ID with approver info
- `PATCH /api/admin/users/:id/approve` - Approve PENDING user
- `PATCH /api/admin/users/:id/reject` - Reject PENDING user with reason
- `PATCH /api/admin/users/:id/disable` - Disable APPROVED user
- `PATCH /api/admin/users/:id/enable` - Re-enable DISABLED user
- `PATCH /api/admin/users/:id/promote` - Change user role

### Institutions (Admin Only)
- `GET /api/institutions` - Get all institutions
- `GET /api/institutions/:id` - Get institution by ID
- `POST /api/institutions` - Create new institution (Admin only)
- `PUT /api/institutions/:id` - Update institution (Admin only)
- `DELETE /api/institutions/:id` - Delete institution (Admin only)

### Projects
- `GET /api/projects` - Get all projects (with optional filtering)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Purchase Requests
- `GET /api/purchase-requests` - Get all requests (filters: status, projectId, dates)
- `GET /api/purchase-requests/:id` - Get request by ID
- `POST /api/purchase-requests` - Create new request (any authenticated user)
- `PUT /api/purchase-requests/:id` - Update request (DRAFT only)
- `POST /api/purchase-requests/:id/submit` - Submit for approval (DRAFT → PENDING)
- `POST /api/purchase-requests/:id/approve` - Approve request (Admin only, PENDING → APPROVED)
- `POST /api/purchase-requests/:id/reject` - Reject request (Admin only, PENDING → REJECTED)
- `POST /api/purchase-requests/:id/deliver` - Mark as delivered (Admin only, APPROVED → DELIVERED)
- `DELETE /api/purchase-requests/:id` - Delete request (Admin only)

## 🔄 Workflow et Cycles de Vie

### Cycle de Vie des Utilisateurs

```
┌─────────────┐
│ INSCRIPTION │
│  (Register) │
└──────┬──────┘
       │
       ▼
  ┌─────────┐
  │ PENDING │ ◄──────────┐ (peut être ré-approuvé)
  └────┬────┘            │
       │                 │
   [Admin Review]        │
       │                 │
       ▼                 │
  ┌─────────┐            │
  │ Decision│            │
  └────┬────┘            │
       │                 │
  ┌────┴────┐            │
  ▼         ▼            │
┌──────┐ ┌──────────┐   │
│APPROVED│ │ REJECTED │──┘
└───┬──┘ └──────────┘
    │
    │ (Admin peut désactiver)
    ▼
┌─────────┐
│ DISABLED│
└────┬────┘
     │
     │ (Admin peut réactiver)
     ▼
  APPROVED
```

**États :**
- **PENDING** : En attente d'approbation, ne peut pas se connecter
- **APPROVED** : Approuvé, peut se connecter et utiliser le système
- **REJECTED** : Rejeté avec raison, ne peut pas se connecter mais peut être ré-approuvé
- **DISABLED** : Temporairement désactivé, peut être réactivé

### Cycle de Vie des Demandes d'Achat

```
┌─────────────────┐
│ Créer Demande   │
│ (Create Request)│
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ DRAFT  │ ◄───── Modifiable librement
    └───┬────┘
        │
        │ Submit
        ▼
   ┌─────────┐
   │ PENDING │ ◄───── En attente admin
   └────┬────┘
        │
   [Admin Review]
        │
    ┌───┴────┐
    ▼        ▼
┌─────────┐ ┌─────────┐
│APPROVED │ │REJECTED │ (État terminal)
└────┬────┘ └─────────┘
     │
     │ Deliver
     ▼
┌──────────┐
│DELIVERED │ (État terminal)
└──────────┘
```

**Transitions autorisées :**
- **DRAFT → PENDING** : Soumission par n'importe quel utilisateur
- **PENDING → APPROVED** : Approbation par admin uniquement
- **PENDING → REJECTED** : Rejet par admin avec raison (terminal)
- **APPROVED → DELIVERED** : Marquage livraison par admin (terminal)

### Règles d'Autorisation

**Admin (Chef de Laboratoire) :**
- ✅ Accès complet à toutes les ressources
- ✅ Approuver/rejeter/désactiver/réactiver utilisateurs
- ✅ Promouvoir utilisateurs vers différents rôles
- ✅ Créer/modifier/supprimer institutions
- ✅ Créer/modifier/supprimer projets
- ✅ Approuver/rejeter/livrer demandes d'achat
- ✅ Consulter toutes les données du système

**Membre (Chercheur) :**
- ✅ Consulter les projets assignés
- ✅ Créer des brouillons de demandes d'achat
- ✅ Soumettre des demandes pour approbation
- ✅ Publier des articles scientifiques
- ⚠️ Ne peut pas approuver, rejeter ou marquer livré
- ⚠️ Ne peut pas accéder à la gestion des utilisateurs
- ⚠️ Ne peut pas créer/modifier institutions ou projets

## 📚 Guide de Développement

### Chronologie de Développement

Le projet a été développé en plusieurs phases progressives :

**Phase 1 - Authentification (Day 1) :**
- ✅ Configuration du projet et structure
- ✅ Système d'authentification basique
- ✅ Implémentation JWT
- ✅ Modèle utilisateur avec rôles
- ✅ Fonctionnalités login/logout

**Phase 2 - Domaine Métier (Day 2) :**
- ✅ Gestion des institutions
- ✅ Gestion des projets
- ✅ Workflow des demandes d'achat
- ✅ Relations de base de données
- ✅ Opérations CRUD pour toutes les entités

**Phase 3 - Gestion Utilisateurs (Day 3) :**
- ✅ Système d'inscription utilisateurs
- ✅ Workflow d'approbation
- ✅ Panel administrateur
- ✅ Tableaux de bord basés sur les rôles
- ✅ Cycle de vie du statut utilisateur

**Phase 4 - Contenu Scientifique (Day 6) :**
- ✅ Système de gestion d'articles
- ✅ Workflow de publication
- ✅ Suivi DOI et citations
- ✅ Contrôle de visibilité
- ✅ Attribution aux auteurs

### Schéma de Base de Données

```sql
-- Tables principales
users (id, firstName, lastName, email, password, role, status, approvedById, approvedAt, rejectionReason)
institutions (id, name, address, contact, description)
lab_info (id, institutionId, labName, director, phone, email, website)
teams (id, name, description, institutionId)
projects (id, name, source, description, startDate, endDate, budget, institutionId, projectManagerId, isActive)
purchase_requests (id, itemName, description, quantity, estimatedPrice, totalPrice, status, projectId, userId, rejectionReason)
articles (id, title, abstract, authors, keywords, publicationDate, journal, doi, pdfUrl, status, visibility, userId, projectId, teamId)

-- Relations clés
users.approvedById → users.id (auto-référence)
projects.institutionId → institutions.id
projects.projectManagerId → users.id
purchase_requests.projectId → projects.id
purchase_requests.userId → users.id
articles.userId → users.id
articles.projectId → projects.id
articles.teamId → teams.id
```

### Documentation Complémentaire

📘 **Guides de configuration détaillés :**
- [DAY2-SETUP.md](DAY2-SETUP.md) - Configuration du domaine métier
- [DAY3-SETUP.md](DAY3-SETUP.md) - Configuration du système d'approbation utilisateurs
- [DAY3-INSTALLATION-GUIDE.md](DAY3-INSTALLATION-GUIDE.md) - Guide d'installation détaillé
- [DAY6-ARTICLES-GUIDE.md](DAY6-ARTICLES-GUIDE.md) - Guide du module articles

📄 **Scripts SQL :**
- [day2-business-models.sql](backend/migrations/day2-business-models.sql) - Tables institutions, projets, demandes
- [day3-user-approval-system.sql](backend/migrations/day3-user-approval-system.sql) - Système d'approbation
- [day6-articles-COMPLET-FINAL.sql](backend/migrations/day6-articles-COMPLET-FINAL.sql) - Module articles
- [fix-timestamps.sql](backend/migrations/fix-timestamps.sql) - Corrections timestamps

## 🎯 Améliorations Futures

### Fonctionnalités Planifiées

**Priorité Haute :**
- [ ] Système de notifications en temps réel
- [ ] Notifications par email pour approbations/rejets
- [ ] Téléchargement de fichiers (PDF articles, devis)
- [ ] Réinitialisation de mot de passe
- [ ] Édition de profil utilisateur

**Priorité Moyenne :**
- [ ] Export de rapports (PDF/Excel)
- [ ] Tableau de bord avec analytics et statistiques
- [ ] Journal d'activité et piste d'audit
- [ ] Recherche avancée multi-critères
- [ ] Filtres et tri avancés

**Priorité Basse :**
- [ ] Authentification à deux facteurs (2FA)
- [ ] Support multi-langue (i18n)
- [ ] Application mobile (React Native/Flutter)
- [ ] Intégration avec Elasticsearch
- [ ] Tableaux de bord de visualisation de données
- [ ] Outils de collaboration en équipe

## 🐛 Dépannage Courant

### Backend ne démarre pas
```bash
# Vérifier que MySQL est démarré
# Windows
services.msc → MySQL

# Vérifier les credentials .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

# Vérifier le port 3000
netstat -ano | findstr :3000
```

### Frontend ne se connecte pas
```bash
# Vérifier que le backend est démarré
curl http://localhost:3000

# Vérifier CORS dans backend/server.js
app.use(cors({ origin: true, credentials: true }))

# Effacer le cache du navigateur
# Supprimer localStorage
localStorage.clear()
```

### Erreur de base de données
```sql
-- Créer la base si elle n'existe pas
CREATE DATABASE lab_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accorder les permissions
GRANT ALL PRIVILEGES ON lab_platform.* TO 'votre_user'@'localhost';
FLUSH PRIVILEGES;

-- Réinitialiser complètement (⚠️ supprime toutes les données)
DROP DATABASE lab_platform;
CREATE DATABASE lab_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📞 Support et Contact

**Pour obtenir de l'aide :**
- 📧 Email : support@cnstn.rnrt.tn
- 🐛 Issues : Créer une issue sur GitHub
- 📖 Documentation : Voir les guides DAY*.md

**Contribution :**
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence et Crédits

**Projet développé pour :** CNSTN (Centre National des Sciences et Technologies Nucléaires)  
**Version :** 1.0.0  
**Dernière mise à jour :** Janvier 2026  
**Statut :** En développement actif

**Technologies utilisées :**
- Construit avec Angular et Node.js
- Base de données MySQL
- Authentification JWT
- UI inspirée des systèmes modernes de gestion de laboratoire

---

**⚠️ Note Importante :** Assurez-vous que MySQL est démarré et que tous les scripts de migration ont été exécutés dans l'ordre avant de démarrer l'application.
