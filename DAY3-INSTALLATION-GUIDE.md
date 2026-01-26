# 🎯 DAY 3 - GUIDE D'INSTALLATION ET DE TEST

## Laboratoire de Recherche en Energie et Matière (LR16CNSTN02)
**Plateforme Web Officielle - Version 3.0**

---

## 📋 ÉTAPE 1 : Exécuter les Migrations SQL

### Option 1 : Depuis MySQL Workbench
1. Ouvrir MySQL Workbench
2. Se connecter à votre base de données `lab_platform`
3. Ouvrir le fichier : `backend/migrations/day3-lab-info.sql`
4. Cliquer sur l'icône "⚡ Execute" (éclair)
5. Vérifier que les tables `lab_info` et `teams` sont créées

### Option 2 : Depuis la ligne de commande
```bash
# Depuis le dossier backend
cd backend

# Exécuter le script SQL
mysql -u root -p lab_platform < migrations/day3-lab-info.sql

# Vérifier les données
mysql -u root -p lab_platform -e "SELECT * FROM lab_info;"
mysql -u root -p lab_platform -e "SELECT * FROM teams ORDER BY display_order;"
```

### Vérification
Les commandes doivent afficher :
- ✅ 1 ligne dans `lab_info` avec le nom complet du laboratoire
- ✅ 4 lignes dans `teams` (les 4 équipes de recherche)

---

## 🚀 ÉTAPE 2 : Démarrer le Backend

```bash
cd backend

# Installer les dépendances (si nécessaire)
npm install

# Démarrer le serveur
npm run dev
```

**Vérification Backend :**
- ✅ Serveur démarre sur `http://localhost:3000`
- ✅ Message : "✅ Connected to MySQL database: lab_platform"
- ✅ Message : "🚀 Server running on port 3000"

### Tester les endpoints publics :
Ouvrir un navigateur et tester :
- http://localhost:3000/api/public/lab-info
- http://localhost:3000/api/public/teams

**Résultats attendus :**
```json
// /api/public/lab-info
{
  "fullName": "Laboratoire de Recherche en Energie et Matière pour le développement des sciences nucléaires (LR16CNSTN02)",
  "shortName": "LR16CNSTN02",
  "address": "Pôle Technologique. 2020 Sidi Thabet, Tunis, Tunisie",
  "createdYear": 2016,
  "mission": "Applications pacifiques des sciences nucléaires...",
  ...
}

// /api/public/teams
[
  {
    "id": 1,
    "name": "Équipe Techniques Radiochimiques",
    ...
  },
  ...
]
```

---

## 🎨 ÉTAPE 3 : Démarrer le Frontend

**Nouvelle fenêtre terminal :**
```bash
cd frontend

# Installer les dépendances (si nécessaire)
npm install

# Démarrer Angular
ng serve
```

**Vérification Frontend :**
- ✅ Compilation réussie
- ✅ Serveur démarre sur `http://localhost:4200`
- ✅ Message : "✔ Compiled successfully"

---

## ✅ ÉTAPE 4 : Tester l'Application Complète

### 1️⃣ Page d'Accueil (Publique)
**URL :** http://localhost:4200/

**Vérifications :**
- ✅ Logo `lr02.jpg` visible en haut du hero
- ✅ Titre complet : "Laboratoire de Recherche en Energie et Matière pour le développement des sciences nucléaires (LR16CNSTN02)"
- ✅ Adresse : "Pôle Technologique Sidi Thabet, Tunis"
- ✅ 2 boutons : "Découvrir le laboratoire" et "Espace collaborateur"
- ✅ Section présentation générale
- ✅ Section avec les 4 équipes (cartes numérotées 01, 02, 03, 04)
- ✅ Header avec navigation
- ✅ Footer avec informations complètes

### 2️⃣ Page À Propos
**URL :** http://localhost:4200/about

**Vérifications :**
- ✅ Header bleu avec titre complet
- ✅ Section "Présentation Générale"
- ✅ Section "Contexte et Problématique"
- ✅ Section "Organisation Scientifique" avec 4 équipes détaillées :
  - Équipe Techniques Radiochimiques
  - Équipe Matériaux Irradiés
  - Équipe Modélisation Physique
  - Équipe Instrumentation Nucléaire
- ✅ Section "Objectifs du Laboratoire"
- ✅ Timeline avec l'évolution du laboratoire
- ✅ Navigation fonctionnelle

### 3️⃣ Navigation et Routing
**Tester les liens suivants :**
- ✅ Logo cliquable → retour à l'accueil
- ✅ "Accueil" → /home
- ✅ "À propos" → /about
- ✅ "Espace interne" → /login (page de connexion existante)
- ✅ Bouton "Découvrir le laboratoire" → /about
- ✅ Bouton "Espace collaborateur" → /login

### 4️⃣ Espace Interne (Connexion)
**URL :** http://localhost:4200/login

**Vérifications :**
- ✅ Header et Footer toujours présents
- ✅ Formulaire de connexion fonctionnel
- ✅ Après connexion → redirection vers dashboard
- ✅ Une fois connecté, le header affiche :
  - Nom d'utilisateur
  - Bouton "Déconnexion"
  - Liens supplémentaires : Tableau de bord, Projets, Demandes d'achat

### 5️⃣ Responsive Design
**Tester sur différentes tailles d'écran :**
- ✅ Desktop (1920x1080) : tout s'affiche correctement
- ✅ Tablette (768px) : adaptation du layout
- ✅ Mobile (375px) : menu responsive, images adaptées

---

## 🎨 IDENTITÉ VISUELLE VÉRIFIÉE

### Couleurs CNSTN Officielles
- ✅ **Bleu principal** : #1E3A8A (header, titres)
- ✅ **Jaune accent** : #F59E0B (boutons, highlights)
- ✅ **Blanc** : #FFFFFF (texte sur fond bleu)
- ✅ **Gris clair** : #F8FAFC (backgrounds)

### Typographie
- ✅ **Titres** : Montserrat Bold (Google Fonts)
- ✅ **Texte** : Inter Regular (Google Fonts)

### Logo
- ✅ Image `lr02.jpg` utilisée partout
- ✅ Format rond avec bordure jaune dans le header
- ✅ Visible en background du hero avec opacité

---

## 📊 POINTS DE CONTRÔLE FINAUX

### Backend (API)
- ✅ Table `lab_info` créée et remplie
- ✅ Table `teams` créée avec 4 équipes
- ✅ Modèles Sequelize `LabInfo.js` et `Team.js`
- ✅ Contrôleur `public.controller.js`
- ✅ Routes `/api/public/*` accessibles sans authentification

### Frontend (Angular)
- ✅ Service `public.service.ts` pour les appels API
- ✅ Modèles TypeScript `lab-info.model.ts`
- ✅ Composant `HomeComponent` (page d'accueil)
- ✅ Composant `AboutComponent` (page à propos)
- ✅ Composant `HeaderComponent` (navigation)
- ✅ Composant `FooterComponent` (pied de page)
- ✅ Routing mis à jour (/ → home, /about, /login)
- ✅ Logo copié dans `assets/images/logo-lr02.jpg`

### Design
- ✅ Couleurs officielles CNSTN partout
- ✅ Nom complet du laboratoire partout
- ✅ Adresse exacte partout
- ✅ Responsive mobile + desktop
- ✅ Animations et effets hover

---

## 🎯 RÉSULTAT ATTENDU

**Site vitrine professionnel** pour le **Laboratoire de Recherche en Energie et Matière (LR16CNSTN02)** avec :

1. ✅ **Page d'accueil publique** moderne et professionnelle
2. ✅ **Page À propos** avec les 4 équipes détaillées
3. ✅ **Séparation claire** entre espace public et espace interne
4. ✅ **Identité visuelle officielle** CNSTN
5. ✅ **Navigation fluide** et intuitive
6. ✅ **Responsive design** pour tous les écrans
7. ✅ **Header et Footer** sur toutes les pages

---

## 🐛 DÉPANNAGE

### Le backend ne démarre pas
```bash
# Vérifier que MySQL est démarré
# Vérifier les credentials dans backend/.env
# Réinstaller les dépendances
npm install
```

### Le frontend affiche des erreurs
```bash
# Vérifier que le backend tourne sur port 3000
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Les images ne s'affichent pas
```bash
# Vérifier que le logo existe
ls frontend/src/assets/images/logo-lr02.jpg

# Si absent, copier à nouveau depuis
C:\Users\dridi\Desktop\projet cnstn\imagess\lr02.jpg
```

### Les données ne s'affichent pas
```bash
# Vérifier que les migrations SQL ont été exécutées
mysql -u root -p lab_platform -e "SELECT COUNT(*) FROM lab_info;"
mysql -u root -p lab_platform -e "SELECT COUNT(*) FROM teams;"

# Résultats attendus : 1 pour lab_info, 4 pour teams
```

---

## 📝 NOTES IMPORTANTES

1. **Base de données** : Assurez-vous que MySQL est démarré et accessible
2. **Ports** : Backend (3000) et Frontend (4200) doivent être libres
3. **Logo** : Le fichier `lr02.jpg` doit être présent dans `frontend/src/assets/images/`
4. **Nom complet** : Utilisé partout de façon cohérente
5. **Adresse** : "Pôle Technologique. 2020 Sidi Thabet, Tunis, Tunisie"

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant une **plateforme web professionnelle** pour le laboratoire LR16CNSTN02, 
prête à être présentée en soutenance de stage ! 🚀

**Version finale : DAY 3 Complete - v3.0.0**
