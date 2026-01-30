pipeline {
    agent any

    environment {
        TAG = 'latest'
        WORKSPACE_DIR = '/home/jenkins/lab-platform'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                git branch: 'main', url: 'https://github.com/rvmzidr/lab-platform.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Construction des images Docker...'
                    sh '''
                        docker build -t ramzi85/lab-platform-backend:${TAG} ./backend
                        docker build -t ramzi85/lab-platform-frontend:${TAG} ./frontend
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '8369d43a-51c6-49bd-ae3b-ddbb23a1a4db',
                    usernameVariable: 'DOCKER_HUB_USERNAME',
                    passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                   
                    sh '''
                        echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin
                        docker push ramzi85/lab-platform-backend:${TAG}
                        docker push ramzi85/lab-platform-frontend:${TAG}
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
                        cd ${WORKSPACE_DIR}
                        docker-compose down || true
                        docker pull ramzi85/lab-platform-backend:${TAG}
                        docker pull ramzi85/lab-platform-frontend:${TAG}
                        docker-compose up -d
                        docker-compose ps
                    '''
                }
            }
        }
    }

    post {
        success { echo 'Pipeline exécuté avec succès! ✓' }
        failure { echo 'Le pipeline a échoué! ✗' }
        always { sh 'docker system prune -f || true' }
    }
}