#!/usr/bin/env groovy
@Library('thesisSampleLib')
import org.thesis_ci_automation_test.*

def slack = new SlackNotifier()
def utils = new Utils()
def dockerArgs = '-v /var/run/docker.sock:/var/run/docker.sock'

pipeline {
  agent none

  options {
    buildDiscarder(logRotator(numToKeepStr:'5'))
    ansiColor('xterm')
  }

  stages {
    stage('Build') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      steps {
        sh 'npm run dependencies'
      }
    }

    stage('Test') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      steps {
        sh 'grunt unit'
      }

      post {
        always {
          junit 'test-results/**/unit-test-results.xml'
        }
      }
    }

    stage('Prepare dev deploy') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      when {
        branch 'dev'
      }

      steps {
        sh 'npm run build:dev'
      }
    }

    stage('Development deploy') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      when {
        branch 'dev'
      }

      steps {
        milestone 1
        lock(resource: 'dev-server', inversePrecedence: true) {
          milestone 2
          retry(count: 3) {
            sh './deploy.dev.sh'
          }
        }
      }
    }

    stage('Accept production deploy') {
      when {
        branch 'master'
      }

      steps {
        milestone 3
        script {
          slack.sendMessage(
            SlackColours.GOOD.colour,
            "Waiting for input (${utils.getBuildLink(env)})"
          )
        }
        input 'Deploy to production?'
        milestone 4
      }
    }

    stage('Prepare production deploy') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      when {
        branch 'master'
      }

      steps {
        sh 'npm run build:prod'       
      }
    }

    stage('Production deploy') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          args dockerArgs
        }
      }

      when {
        branch 'master'
      }

      steps {
        milestone 5
        lock(resource: 'prod-server', inversePrecedence: true) {
          milestone 6
          retry(count: 3) {
            sh './deploy.prod.sh'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        slack.notify(currentBuild, currentBuild.getResult(), env)
      }
    }
  }
}
