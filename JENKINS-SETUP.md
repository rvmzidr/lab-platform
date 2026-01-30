# Configuration Jenkins pour Lab Platform

## 📋 Prérequis sur le serveur Linux Jenkins

### 1. Installation de Docker
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur jenkins au groupe docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Vérifier l'installation
docker --version
docker-compose --version
```

### 2. Installation de Jenkins
```bash
# Ajouter la clé Jenkins
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -

# Ajouter le dépôt Jenkins
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Installer Jenkins
sudo apt update
sudo apt install jenkins -y

# Démarrer Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Obtenir le mot de passe initial
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Accédez à Jenkins via: `http://votre-ip-serveur:8080`

---

## ⚙️ Configuration de Jenkins

### 1. Créer les credentials Docker Hub

1. Dans Jenkins, allez à: **Manage Jenkins** → **Manage Credentials**
2. Cliquez sur **(global)** → **Add Credentials**
3. Remplissez:
   - **Kind**: Username with password
   - **Username**: `ramzi85`
   - **Password**: Votre mot de passe Docker Hub
   - **ID**: `docker-hub-credentials`
   - **Description**: Docker Hub Credentials
4. Cliquez sur **Create**

### 2. Installer les plugins nécessaires

Allez à **Manage Jenkins** → **Manage Plugins** → **Available** et installez:
- **Docker Pipeline**
- **GitHub Integration**
- **Pipeline**
- **Git**

### 3. Créer un nouveau Job Pipeline

1. Cliquez sur **New Item**
2. Nom: `lab-platform-deployment`
3. Type: **Pipeline**
4. Cliquez sur **OK**

### 4. Configuration du Pipeline

Dans la configuration du job:

#### General
- ✓ **GitHub project**: `https://github.com/VOTRE-USERNAME/lab-platform`

#### Build Triggers
- ✓ **GitHub hook trigger for GITScm polling**

#### Pipeline
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/VOTRE-USERNAME/lab-platform.git`
- **Branch Specifier**: `*/main` (ou `*/master`)
- **Script Path**: `Jenkinsfile`

Cliquez sur **Save**

---

## 🔗 Configuration du Webhook GitHub

### Sur GitHub:

1. Allez dans votre repository → **Settings** → **Webhooks**
2. Cliquez sur **Add webhook**
3. Remplissez:
   - **Payload URL**: `http://VOTRE-IP-SERVEUR-JENKINS:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Which events**: Just the push event
   - ✓ Active
4. Cliquez sur **Add webhook**

---

## 📁 Préparation du serveur Jenkins

### 1. Créer le répertoire de travail
```bash
sudo mkdir -p /home/jenkins/lab-platform
sudo chown -R jenkins:jenkins /home/jenkins/lab-platform
cd /home/jenkins/lab-platform
```

### 2. Créer les fichiers d'environnement

Créez le fichier `.env`:
```bash
cat > /home/jenkins/lab-platform/.env << 'EOF'
# Docker Compose ports
BACKEND_PORT=3000
FRONTEND_PORT=4200

# MySQL Configuration
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=lab_platform
MYSQL_USER=labuser
MYSQL_PASSWORD=labpassword

# Backend Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_NAME=lab_platform
DB_USER=labuser
DB_PASSWORD=labpassword
WORKSPACE=/home/jenkins/lab-platform
EOF
```

Créez le fichier `.env.build`:
```bash
cat > /home/jenkins/lab-platform/.env.build << 'EOF'
# Docker Hub Configuration
DOCKER_HUB_USERNAME=ramzi85
TAG=latest

# Application Ports
BACKEND_PORT=3000
FRONTEND_PORT=4200
EOF
```

### 3. Copier le docker-compose.yml
```bash
# Le fichier sera récupéré automatiquement depuis GitHub lors du premier build
# Mais vous pouvez le copier manuellement si nécessaire
```

---

## 🚀 Script Shell complet pour Jenkins

Si vous préférez utiliser un **Freestyle Project** au lieu d'un Pipeline, voici le script shell à mettre dans **Build** → **Execute Shell**:

```bash
#!/bin/bash
set -e

# Variables d'environnement
export DOCKER_HUB_USERNAME=ramzi85
export TAG=latest
export WORKSPACE_DIR=/home/jenkins/lab-platform

echo "========================================="
echo "🚀 Début du déploiement Lab Platform"
echo "========================================="

# 1. Navigation vers le workspace
cd $WORKSPACE_DIR

# 2. Récupération du code (si pas déjà fait par Jenkins)
echo "📥 Synchronisation des fichiers..."
rsync -av --exclude='.git' --exclude='node_modules' $WORKSPACE/ $WORKSPACE_DIR/ || true

# 3. Construction des images Docker
echo "🔨 Construction de l'image Backend..."
cd backend
docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG} .

echo "🔨 Construction de l'image Frontend..."
cd ../frontend
docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG} .

# 4. Connexion à Docker Hub
echo "🔐 Connexion à Docker Hub..."
echo "$DOCKER_HUB_PASSWORD" | docker login -u $DOCKER_HUB_USERNAME --password-stdin

# 5. Push des images
echo "⬆️  Push de l'image Backend..."
docker push ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG}

echo "⬆️  Push de l'image Frontend..."
docker push ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG}

# 6. Déconnexion de Docker Hub
docker logout

# 7. Déploiement local
echo "🚢 Déploiement local avec docker-compose..."
cd $WORKSPACE_DIR

# Arrêt des anciens conteneurs
docker-compose down || true

# Pull des nouvelles images
docker pull ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG}
docker pull ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG}

# Démarrage des services
docker-compose up -d

# 8. Vérification
echo "✅ Vérification des conteneurs..."
docker-compose ps

# 9. Nettoyage
echo "🧹 Nettoyage des images inutilisées..."
docker system prune -f

echo "========================================="
echo "✅ Déploiement terminé avec succès!"
echo "========================================="
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:4200"
```

### Pour utiliser ce script:

1. Dans Jenkins, créez un **Freestyle project**
2. Dans **Source Code Management**: choisissez **Git** et ajoutez votre repository
3. Dans **Build Triggers**: cochez **GitHub hook trigger for GITScm polling**
4. Dans **Build Environment**: 
   - Cochez **Use secret text(s) or file(s)**
   - Ajoutez **Username and password (separated)**: 
     - Username Variable: `DOCKER_HUB_USERNAME`
     - Password Variable: `DOCKER_HUB_PASSWORD`
     - Credentials: Sélectionnez vos credentials Docker Hub
5. Dans **Build** → **Add build step** → **Execute shell**: collez le script ci-dessus
6. Sauvegardez

---

## 🧪 Test du pipeline

### Test manuel:
Dans Jenkins, cliquez sur **Build Now** pour tester.

### Test automatique:
1. Modifiez un fichier dans votre projet local
2. Committez et pushez sur GitHub:
```bash
git add .
git commit -m "Test auto-deploy"
git push origin main
```
3. Jenkins devrait détecter automatiquement le push et lancer le build

---

## 📊 Vérification après déploiement

```bash
# Sur le serveur Jenkins
docker ps
docker-compose logs -f backend
docker-compose logs -f frontend

# Vérifier les images
docker images | grep ramzi85
```

---

## 🔧 Dépannage

### Si Jenkins ne peut pas se connecter à Docker:
```bash
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Si le webhook GitHub ne fonctionne pas:
1. Vérifiez que le port 8080 est ouvert sur votre serveur
2. Vérifiez les logs du webhook sur GitHub
3. Vérifiez les logs Jenkins: `/var/log/jenkins/jenkins.log`

### Si les conteneurs ne démarrent pas:
```bash
docker-compose logs
docker-compose down -v
docker-compose up -d
```

---

## 📝 Notes importantes

1. **Sécurité**: Changez les mots de passe par défaut dans `.env`
2. **Firewall**: Ouvrez les ports nécessaires (8080 pour Jenkins, 3000, 4200 pour l'app)
3. **Backups**: Configurez des sauvegardes régulières de la base de données
4. **SSL**: Envisagez d'ajouter un reverse proxy (Nginx) avec SSL pour la production

---

## ✅ Checklist finale

- [ ] Docker installé sur le serveur Jenkins
- [ ] Jenkins installé et accessible
- [ ] Credentials Docker Hub configurés dans Jenkins
- [ ] Plugins Jenkins installés
- [ ] Job Pipeline créé
- [ ] Webhook GitHub configuré
- [ ] Fichiers `.env` et `.env.build` créés sur le serveur
- [ ] Premier build manuel réussi
- [ ] Push test sur GitHub déclenche le build automatiquement
