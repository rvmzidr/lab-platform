pipeline {
    agent any

    environment {
        TAG = 'latest'
        // Utilise le workspace Jenkins par défaut
        WORKSPACE_DIR = "${env.WORKSPACE}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                git branch: 'main', url: 'https://github.com/rvmzidr/lab-platform.git'
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo '⚙️ Création des fichiers d environnement...'
                    dir("${WORKSPACE_DIR}") {
                        sh '''
                            cat > .env << 'EOF'
BACKEND_PORT=3000
FRONTEND_PORT=4200
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=lab_platform
MYSQL_USER=labuser
MYSQL_PASSWORD=labpassword
DB_HOST=mysql
DB_PORT=3306
DB_NAME=lab_platform
DB_USER=labuser
DB_PASSWORD=labpassword
EOF

                            cat > .env.build << 'EOF'
DOCKER_HUB_USERNAME=ramzi85
TAG=latest
BACKEND_PORT=3000
FRONTEND_PORT=4200
EOF

                            echo '✅ Fichiers .env créés'
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Construction des images Docker...'
                    sh """
                        docker build -t ramzi85/lab-platform-backend:${TAG} ./backend
                        docker build -t ramzi85/lab-platform-frontend:${TAG} ./frontend
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '8369d43a-51c6-49bd-ae3b-ddbb23a1a4db', // ID de tes credentials Jenkins
                    usernameVariable: 'DOCKER_HUB_USERNAME',
                    passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                   
                    sh """
                        echo \$DOCKER_HUB_PASSWORD | docker login -u \$DOCKER_HUB_USERNAME --password-stdin
                        docker push \$DOCKER_HUB_USERNAME/lab-platform-backend:${TAG}
                        docker push \$DOCKER_HUB_USERNAME/lab-platform-frontend:${TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Deploy to Local') {
            steps {
                script {
                    echo 'Déploiement local avec docker compose...'
                    dir("${WORKSPACE_DIR}") {
                        sh """
                            # Arrêter d'éventuels containers existants
                            docker compose down || true

                            # Pull des images Docker Hub
                            docker pull ramzi85/lab-platform-backend:${TAG}
                            docker pull ramzi85/lab-platform-frontend:${TAG}

                            # Démarrer avec docker compose
                            docker compose up -d
                            
                            docker compose ps
                        """
                    }
                }
            }
        }
        
        stage('Initialize Database') {
            steps {
                script {
                    echo '📊 Initialisation de la base de données...'
                    dir("${WORKSPACE_DIR}") {
                        sh """
                            # Attendre que MySQL soit prêt (jusqu'à 2 minutes)
                            echo '⏳ Attente de l initialisation complète de MySQL...'
                            sleep 45
                            
                            echo 'Vérification de la connexion MySQL...'
                            for i in \$(seq 1 20); do
                                if docker exec mysql-db mysql -uroot -proot -e "SELECT 1" 2>/dev/null; then
                                    echo '✅ MySQL est prêt!'
                                    break
                                fi
                                echo "Tentative \$i/20 - attente..."
                                sleep 3
                            done
                            
                            # Import de votre base complète
                            echo '▶️  Import de database-export.sql'
                            docker exec -i mysql-db mysql -uroot -proot < backend/migrations/database-export.sql
                            
                            echo '✅ Base de données importée avec succès!'
                            
                            # Vérifier les tables créées
                            docker exec mysql-db mysql -uroot -proot lab_platform -e "SHOW TABLES;"
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline exécuté avec succès! ✓'
        }
        failure {
            echo 'Le pipeline a échoué! ✗'
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}