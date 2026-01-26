# DAY 6: Scientific Articles Feature - Implementation Complete ✅

## Vue d'ensemble

Le système de gestion d'articles scientifiques a été entièrement implémenté avec 3 niveaux d'accès:

### 🌍 **Public (Visiteurs non authentifiés)**
- Accès à la page des articles publics: `http://localhost:4200/articles`
- Affichage uniquement des articles avec `status='published'` et `visibility='public'`
- Filtres: année, équipe de recherche, recherche par mots-clés
- Pagination: 9 articles par page (grille 3x3)
- Boutons: Voir détails, DOI, PDF

### 👥 **Membres (Utilisateurs authentifiés)**
- Accès au tableau de bord articles: `http://localhost:4200/dashboard/articles`
- Affichage des articles `published` (public + members_only)
- Filtres avancés: statut, visibilité, équipe, projet, recherche
- Vue tableau avec toutes les métadonnées
- Boutons: Voir, (Edit/Delete si admin)

### 👑 **Admin (Chef de laboratoire)**
- Tous les droits des membres +
- Création de nouveaux articles
- Édition d'articles existants
- Suppression d'articles
- Gestion des statuts (draft, published, archived)
- Gestion de la visibilité (public, members_only)

---

## 📋 Étapes d'installation et démarrage

### 1️⃣ Exécuter le script SQL

```bash
# Ouvrir phpMyAdmin (Laragon)
# Sélectionner la base de données: lab_platform
# Cliquer sur "SQL"
# Copier-coller le contenu de: backend/migrations/day6-scientific-articles.sql
# IMPORTANT: Avant d'exécuter, mettre à jour les IDs dans les INSERT statements!
```

**⚠️ ATTENTION**: Modifier les valeurs dans le script SQL:

```sql
-- Récupérer les IDs valides d'abord:
SELECT id, firstName, lastName FROM users WHERE role = 'admin' LIMIT 1;
SELECT id, name FROM projects LIMIT 5;
SELECT id, name FROM teams;

-- Puis remplacer dans chaque INSERT:
userId = [ID de votre admin]
projectId = [ID d'un projet existant ou NULL]
teamId = [ID d'une équipe existante ou NULL]
```

### 2️⃣ Démarrer le backend

```bash
cd backend
npm run dev
# Le serveur démarre sur http://localhost:8080
# Vérifier les logs: "Sequelize: synced all models"
```

### 3️⃣ Démarrer le frontend

```bash
cd frontend
ng serve
# L'application démarre sur http://localhost:4200
```

---

## 🧪 Tests à effectuer

### Test 1: Accès Public
1. Ouvrir navigateur en mode incognito: `http://localhost:4200/articles`
2. ✅ Doit afficher uniquement les articles publics publiés
3. ✅ Filtres doivent fonctionner (année, équipe, recherche)
4. ✅ Cliquer sur un article → voir page de détails
5. ✅ Cliquer sur "View PDF" → ouvrir le DOI dans nouvel onglet

### Test 2: Accès Membre
1. Se connecter avec un compte membre
2. Aller à `http://localhost:4200/dashboard/articles`
3. ✅ Doit afficher articles publics + members_only (tous publiés)
4. ✅ Filtres avancés doivent fonctionner
5. ✅ Boutons Edit/Delete NE DOIVENT PAS apparaître

### Test 3: Accès Admin
1. Se connecter avec le compte admin
2. Aller à `http://localhost:4200/dashboard/articles`
3. ✅ Bouton "Add New Article" doit apparaître
4. ✅ Créer un nouvel article:
   - Remplir titre et auteurs (obligatoires)
   - Choisir statut: draft
   - Choisir visibilité: members_only
   - Associer à un projet et une équipe
   - Sauvegarder
5. ✅ L'article doit apparaître dans le tableau
6. ✅ Éditer l'article → changer statut à "published"
7. ✅ Aller en mode public → l'article NE doit PAS apparaître (members_only)
8. ✅ Changer visibilité à "public" → l'article DOIT apparaître en mode public

### Test 4: Filtres et recherche
1. Sur la page publique, tester:
   - ✅ Filtre par année
   - ✅ Filtre par équipe
   - ✅ Recherche par mots-clés (titre, abstract, keywords, auteurs)
   - ✅ Pagination (si plus de 9 articles)

### Test 5: Associations
1. En admin, créer un article associé à un projet
2. ✅ L'article doit afficher le nom du projet dans la vue détails
3. ✅ Supprimer le projet → l'article doit rester (projectId = NULL)
4. ✅ Supprimer l'auteur (user) → l'article DOIT être supprimé (CASCADE)

---

## 🗂️ Structure des fichiers créés

### Backend (Node.js + Express + Sequelize)
```
backend/
├── models/
│   ├── Article.js                    ✅ Modèle Sequelize
│   └── index.js                      ✅ Associations ajoutées
├── controllers/
│   └── article.controller.js         ✅ 11 fonctions (CRUD + filtres)
├── routes/
│   └── article.routes.js             ✅ Routes publiques + authentifiées + admin
├── migrations/
│   └── day6-scientific-articles.sql  ✅ Script SQL complet
└── server.js                         ✅ Routes montées
```

### Frontend (Angular 17)
```
frontend/src/app/
├── models/
│   └── article.model.ts                           ✅ Interface TypeScript
├── services/
│   └── article.service.ts                         ✅ HTTP calls + helpers
├── components/articles/
│   ├── public-articles/
│   │   ├── public-articles.component.ts          ✅ Grille publique
│   │   ├── public-articles.component.html        ✅ Cards design
│   │   └── public-articles.component.css         ✅ Style responsive
│   ├── articles-list/
│   │   ├── articles-list.component.ts            ✅ Tableau admin/membre
│   │   ├── articles-list.component.html          ✅ CRUD modal
│   │   └── articles-list.component.css           ✅ Style professionnel
│   └── article-detail/
│       ├── article-detail.component.ts           ✅ Vue détaillée
│       ├── article-detail.component.html         ✅ Métadonnées complètes
│       └── article-detail.component.css          ✅ Design élégant
├── app-routing.module.ts                         ✅ 3 routes ajoutées
└── app.module.ts                                 ✅ Composants déclarés
```

---

## 🎨 Design Features

### Page Publique (Public Articles)
- **Layout**: Grille responsive 3 colonnes
- **Couleurs**: Thème CNSTN (#2C5F7F, #3A7CA5)
- **Cards**: Effet hover avec shadow
- **Filtres**: Barre sticky avec dropdowns
- **Pagination**: Boutons stylisés avec indicateur de page

### Dashboard Admin/Membre
- **Tableau**: Lignes alternées avec hover
- **Badges**: Status colorés (draft=jaune, published=vert, archived=gris)
- **Modal**: Formulaire en 2 colonnes pour création/édition
- **Actions**: Icônes Font Awesome (edit, delete, view)

### Page de Détails
- **Header**: Titre en grand avec badges
- **Metadata Grid**: Disposition en grille avec icônes
- **Sections**: Abstract, Keywords, Team, Project
- **Boutons**: CTA pour PDF et DOI

---

## 🔧 Fonctionnalités avancées implémentées

### Backend
1. **Filtrage avancé**: Année, équipe, projet, recherche full-text, statut, visibilité
2. **Pagination**: Page, limit avec calcul automatique totalPages
3. **Associations**: Include automatique User, Project, Team
4. **Validation**: Champs requis, DOI unique
5. **Permissions**: Vérification role dans le contrôleur
6. **Statistics endpoint**: GET /api/articles/admin/stats

### Frontend
1. **Helper methods**: formatAuthors, getPublicationYear, getDoiUrl
2. **Badge classes**: Couleurs dynamiques selon status/visibility
3. **Responsive design**: Mobile-friendly (media queries)
4. **Error handling**: Messages d'erreur clairs
5. **Success feedback**: Alerts temporaires après actions
6. **Empty states**: Messages quand aucun article trouvé

---

## 📊 Endpoints API disponibles

### Public (No Auth)
```
GET  /api/articles/public                    // Liste articles publics
GET  /api/articles/public/project/:id        // Articles publics d'un projet
GET  /api/articles/public/team/:id           // Articles publics d'une équipe
```

### Authenticated (JWT Required)
```
GET  /api/articles/                          // Tous articles (role-based)
GET  /api/articles/:id                       // Article par ID
GET  /api/articles/project/:id               // Articles d'un projet
GET  /api/articles/team/:id                  // Articles d'une équipe
```

### Admin Only (JWT + isAdmin)
```
POST   /api/articles/                        // Créer article
PUT    /api/articles/:id                     // Modifier article
DELETE /api/articles/:id                     // Supprimer article
GET    /api/articles/admin/stats             // Statistiques
```

### Query Parameters (GET requests)
```
?year=2025                  // Filtrer par année
?teamId=1                   // Filtrer par équipe
?projectId=2                // Filtrer par projet
?search=nuclear             // Recherche mots-clés
?status=published           // Filtrer par statut (admin)
?visibility=public          // Filtrer par visibilité
?page=1&limit=10            // Pagination
```

---

## 🚀 Prochaines améliorations possibles

### Phase 2 (Optionnel)
1. **Upload PDF local**: Ajouter multer pour upload fichiers
2. **Recherche full-text**: Index MySQL FULLTEXT
3. **Export PDF**: Générer PDF des détails d'article
4. **Citations**: Compteur de citations
5. **Co-auteurs**: Table séparée pour gérer plusieurs auteurs
6. **Catégories**: Tags hiérarchiques (thématiques)
7. **Favoris**: Membres peuvent "sauvegarder" des articles
8. **Notifications**: Alerter équipe quand nouvel article publié

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module 'Article'"
- Vérifier que `Article.js` existe dans `backend/models/`
- Vérifier export dans `backend/models/index.js`
- Redémarrer le serveur backend

### Erreur: "Foreign key constraint fails"
- Les IDs dans le SQL doivent exister dans users/projects/teams
- Vérifier avec les requêtes SELECT avant d'insérer

### Articles ne s'affichent pas (page vide)
- Vérifier que les articles existent: `SELECT * FROM articles;`
- Vérifier status='published' et visibility='public' pour public
- Ouvrir la console navigateur pour voir erreurs HTTP

### Erreur 401 Unauthorized
- Token JWT expiré → se reconnecter
- Vérifier que le header Authorization est envoyé
- Vérifier auth.interceptor.ts est bien configuré

### CORS Error
- Vérifier `app.use(cors({ origin: 'http://localhost:4200' }))` dans server.js
- Vérifier que le frontend tourne sur port 4200

---

## ✅ Checklist de déploiement

- [ ] Script SQL exécuté avec IDs valides
- [ ] Backend démarré sans erreurs
- [ ] Frontend compilé sans erreurs
- [ ] Test public access (mode incognito)
- [ ] Test membre access (compte membre)
- [ ] Test admin access (CRUD complet)
- [ ] Test filtres et pagination
- [ ] Test responsive design (mobile)
- [ ] Test associations (project, team, user)
- [ ] Test suppression en cascade

---

## 📞 Support

Pour toute question:
1. Vérifier les logs backend: `console.log` dans les contrôleurs
2. Vérifier la console navigateur: F12 → Console → Network
3. Tester les endpoints avec Postman/Thunder Client
4. Vérifier la base de données avec phpMyAdmin

**Bon travail avec Day 6! 🎉**
