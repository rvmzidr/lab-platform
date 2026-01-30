pipeline {
    agent any
    
    environment {
        // Docker Hub credentials (à configurer dans Jenkins)
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_HUB_USERNAME = 'ramzi85'
        TAG = 'latest'
        WORKSPACE_DIR = '/home/jenkins/lab-platform'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Construction des images Docker...'
                    
                    // Build Backend
                    sh '''
                        cd backend
                        docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG} .
                    '''
                    
                    // Build Frontend
                    sh '''
                        cd frontend
                        docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG} .
                    '''
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Connexion à Docker Hub et push des images...'
                    sh '''
                        echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
                        docker push ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG}
                        docker push ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG}
                        docker logout
                    '''
                }
            }
        }
        
        stage('Deploy to Local') {
            steps {
                script {
                    echo 'Déploiement local avec docker-compose...'
                    sh '''
                        # Arrêter les anciens conteneurs
                        docker-compose down || true
                        
                        # Pull les nouvelles images
                        docker pull ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG}
                        docker pull ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG}
                        
                        # Démarrer les services
                        docker-compose up -d || true
                        
                        # Vérifier le statut
                        docker-compose ps || true
                    '''
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
            // Nettoyage des images non utilisées
            sh 'docker system prune -f || true'
        }
    }
}
