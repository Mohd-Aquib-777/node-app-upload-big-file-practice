pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // This pulls your code from Git
                checkout scm
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    // -d runs it in the background
                    // --build ensures images are updated if Dockerfiles changed
                    sh 'docker compose up -d --build'
                }
            }
        }

        stage('Verify Services') {
            steps {
                sh 'docker compose ps'
            }
        }
        
        stage('Cleanup (Optional)') {
            steps {
                // Use this if you only want to run tests and then shut down
                // sh 'docker compose down'
            }
        }
    }
}