pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'ramzi85'
        DOCKER_HUB_PASSWORD = credentials('dockercred') // ID متاعك في Jenkins Credentials
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
                        docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG} ./backend
                        docker build -t ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG} ./frontend
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Connexion à Docker Hub et push des images...'
                    sh '''
                        echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin
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
                        cd ${WORKSPACE_DIR}
                        docker-compose down || true
                        docker pull ${DOCKER_HUB_USERNAME}/lab-platform-backend:${TAG} || true
                        docker pull ${DOCKER_HUB_USERNAME}/lab-platform-frontend:${TAG} || true
                        docker-compose up -d || true
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
            sh 'docker system prune -f || true'
        }
    }
}