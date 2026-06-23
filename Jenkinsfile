pipeline {
    agent any

    environment {
        IMAGE_NAME = "agung114/nodejs-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Clone') {
            steps {
                // Menggunakan git plugin bawaan Jenkins yang aman di Windows
                git branch: 'main', url: 'https://github.com/agung114/nodejs-app.git'
            }
        }

        stage('Build Docker') {
            steps {
                // Menggunakan bat untuk Windows host
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Push Docker') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    // Penyesuaian login docker dan push versi Windows bat
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }

        stage('Update Manifest GitOps') {
            steps {
                // Pastikan 'github-token-jenkins' di Jenkins bertipe "Username with password"
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-token-jenkins', 
                        passwordVariable: 'GIT_PASSWORD', 
                        usernameVariable: 'GIT_USERNAME'
                    )
                ]) {
                    bat """
                    @echo off
                    
                    :: 1. Hapus folder manifest lama jika ada sisa build
                    if exist nodejs-manifest rmdir /s /q nodejs-manifest
                    
                    :: 2. Clone repository GitOps
                    git clone https://github.com/agung114/nodejs-manifest.git
                    
                    :: 3. Masuk ke folder
                    cd nodejs-manifest
                    
                    :: 4. Update tag image di deployment.yaml dengan metode PowerShell Windows yang aman
                    powershell -Command "(Get-Content deployment.yaml) -replace 'image: agung114/nodejs-app:.*', 'image: agung114/nodejs-app:%IMAGE_TAG%' | Set-Content deployment.yaml"
                    
                    :: 5. Set identitas Git lokal
                    git config user.email "jenkins@localhost"
                    git config user.name "Jenkins Automation"
                    
                    :: 6. Susupkan Token ke URL Remote (Gunakan % untuk Windows Bat)
                    git remote set-url origin https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/agung114/nodejs-manifest.git
                    
                    :: 7. Add, Commit, dan Push
                    git add deployment.yaml
                    git commit -m "auto-update image to version %IMAGE_TAG% [skip ci]"
                    git push origin main
                    """
                }
            }
        }
    }
}