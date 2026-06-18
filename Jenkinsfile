pipeline {

```
agent any

environment {
    IMAGE_NAME = "agung114/nodejs-app"
    IMAGE_TAG = "${BUILD_NUMBER}"
    GITHUB_CREDENTIAL_ID = "github-token"
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

                if exist nodejs-manifest rmdir /s /q nodejs-manifest

                git clone https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/agung114/nodejs-manifest.git

                cd nodejs-manifest

                powershell -Command "(Get-Content deployment.yaml) -replace 'image: agung114/nodejs-app:.*', 'image: %IMAGE_NAME%:%IMAGE_TAG%' | Set-Content deployment.yaml"

                git config user.email "jenkins@localhost"
                git config user.name "Jenkins Automation"

                git add deployment.yaml

                git commit -m "auto-update image to version %IMAGE_TAG% [skip ci]"

                git push origin main
                """
            }
        }
    }
}
```

}
