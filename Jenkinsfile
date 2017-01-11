#!/usr/bin/env groovy
@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*

pipeline {
  agent {
    dockerfile { filename 'Dockerfile.test' }
  }

  options {
    buildDiscarder(logRotator(numToKeepStr:'5'))
  }

  stages {
    stage('Build') {
      steps {
        sh 'npm run dependencies'
      }
    }

    stage('Test') {
      steps {
        sh 'grunt unit'
      }

      post {
        always {
          junit 'test-results/**/unit-test-results.xml'
        }
      }
    }

    stage('Development deploy') {
      steps {
        milestone 1
        lock(resource: 'dev-server', inversePrecedence: true) {
          milestone 2
          sh './deploy.dev.sh'
        }
      }
    }

    stage('Production deploy') {
      steps {
        milestone 3
        SlackNotifier.sendMessage(steps, SlackColours.GOOD.colour, 'Waiting for input')

        input 'Deploy to production?'
        lock(resource: 'prod-server', inversePrecedence: true) {
          milestone 4
          sh './deploy.prod.sh'
        }
      }
    }
  }

  post {
    success {
      SlackNotifier.notify(this, steps, currentBuild.getResult())
    }

    aborted {
      echo 'Build aborted, skipping notifications'
    }

    failure {
      SlackNotifier.notify(this, steps, currentBuild.getResult())
    }
  }
}
