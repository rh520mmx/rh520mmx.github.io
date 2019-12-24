pipeline {
  environment {
    registry = "registry-vpc.cn-hangzhou.aliyuncs.com/newops/mercury"
    registryCredential = 'f8e2e6ef-e703-4f0b-bb41-9f2f7f562cad'
    dockerImage = ''
  }
  agent any
  
  stages {
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
        }
      }
    }
    stage('Deploy Image') {
      steps{
         script {
            docker.withRegistry( 'https://registry-vpc.cn-hangzhou.aliyuncs.com', registryCredential ) {
            dockerImage.push()
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}
