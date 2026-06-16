pipeline {

    agent any

    environment {
        IMAGE_NAME = "agung114/nodejs-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        // ID Credential GitHub Token yang Anda simpan di Jenkins GUI
        GITHUB_CREDENTIAL_ID = "github-token-jenkins"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                url: 'https://github.com/agung114/nodejs-app.git'
            }
        }

        stage('Build Docker') {
            steps {
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
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
                    bat """
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    docker push %IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }

        stage('Update Manifest GitOps') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${GITHUB_CREDENTIAL_ID}",
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )
                ]) {
                    bat """
                    @echo off
                    
                    :: 1. Hapus folder repo lama jika ada sisa dari build sebelumnya supaya tidak bentrok
                    if exist nodejs-manifest rmdir /s /q nodejs-manifest

                    :: 2. Clone repositori manifest menggunakan token akses
                    git clone https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/agung114/nodejs-manifest.git
                    cd nodejs-manifest

                    :: 3. Ubah tag image di deployment.yaml menggunakan mesin PowerShell bawaan Windows
                    powershell -Command "(Get-Content deployment.yaml) -replace 'image: agung114/nodejs-app:.*', 'image: %IMAGE_NAME%:%IMAGE_TAG%' | Set-Content deployment.yaml"

                    :: 4. Set identitas robot Git agar diizinkan melakukan commit
                    git config user.email "jenkins@agung.com"
                    git config user.name "Jenkins Automation"

                    :: 5. Simpan perubahan dan dorong (push) kembali ke GitHub
                    git add deployment.yaml
                    git commit -m "Pipeline Auto-Update: image to v%IMAGE_TAG%"
                    git push origin main
                    """
                }
            }
        }

    }
}