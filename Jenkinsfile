pipeline {
    agent any

    stages {
        
        stage('Checkout') {
            steps {
                // This pulls your code from Git
                git branch: 'master-jenkins-practice', url: 'https://github.com/Mohd-Aquib-777/node-app-upload-big-file-practice.git'
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    try{
                        sh '''
                        pwd
                        ls
                        docker compose down
                        docker compose up -d --build
                        '''
                        // -d runs it in the background
                        // --build ensures images are updated if Dockerfiles changed
                        // sh 'docker compose up -d --build'
                    }catch(err){
                        echo "Failed to start docker compose ${err}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('Backup Last Successful Build') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'currentBuild = ${currentBuild}'
                sh '''
                mkdir -p /backup/My-Pipeline-${BUILD_NUMBER}
                cp -r ${WORKSPACE}/* /backup/My-Pipeline-${BUILD_NUMBER}/
                '''
            }
        }

        stage('Verify Services') {
            steps {
                sh 'docker compose ps'
            }
        }
        
        // stage('Cleanup (Optional)') {
        //     steps {
        //         // Use this if you only want to run tests and then shut down
        //         // sh 'docker compose down'
        //     }
        // }

    }
    // post {
    //     success {
    //         sh '''
    //         echo "✅ Build successful. Taking backup..."

    //         BACKUP_DIR="/var/jenkins_home/backups/My-Pipeline/build-${BUILD_NUMBER}"

    //         mkdir -p $BACKUP_DIR

    //         cp -r ${WORKSPACE}/* $BACKUP_DIR/

    //         echo "📦 Backup stored at $BACKUP_DIR"
    //         '''
    //     }
    // }
}