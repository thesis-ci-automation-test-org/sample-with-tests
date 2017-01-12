#!/usr/bin/env groovy
@Library('thesisSampleLib')
import org.thesis_ci_automation_test.*

def slack = new SlackNotifier()
def utils = new Utils()

pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.test'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
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

    stage('Prepare deploy') {
      when {
        expression {
          return env.BRANCH_NAME != 'master' // TODO: Switch to only include "dev"
        }
      }

      steps {
        sh 'npm run build:dev'
      }
    }

    stage('Development deploy') {
      when {
        expression {
          return env.BRANCH_NAME != 'master' // TODO: Switch to only include "dev"
        }
      }

      steps {
        milestone 1
        lock(resource: 'dev-server', inversePrecedence: true) {
          milestone 2
          sh './deploy.dev.sh'
        }
      }
    }

    stage('Production deploy') {
      when {
        expression {
          return env.BRANCH_NAME == 'master'
        }
      }

      steps {
        milestone 3
        script {
          slack.sendMessage(
            SlackColours.GOOD.colour,
            "Waiting for input (${utils.getBuildLink(env)}})"
          )
        }
        input 'Deploy to production?'
        lock(resource: 'prod-server', inversePrecedence: true) {
          milestone 4
          sh './deploy.prod.sh'
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
