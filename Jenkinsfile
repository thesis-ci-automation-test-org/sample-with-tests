#!/usr/bin/env groovy
@Library('thesisSampleLib')
import org.thesis_ci_automation_test.*

def slack = new SlackNotifier()
def utils = new Utils()

def dockerEnv = null

properties([buildDiscarder(logRotator(numToKeepStr: '5'))])

try {

  node {
    dockerEnv = docker.build('sample-with-tests_build', '-f Dockerfile.test .')
    dockerEnv.inside {

      stage('Checkout') {
        checkout scm
      }

      stage('Build') {
        sh 'npm run dependencies'
      }

      stage('Test') {
        try {
          sh 'grunt unit'
        } finally {
          junit 'test-results/**/unit-test-results.xml'
        }
      }

      stage('Prepare dev deploy') {
        // TODO: Switch to "== dev"
        // TODO: Mark stage as "NOT_BUILT", when available outside Blue Ocean
        if (env.BRANCH_NAME != 'master') {
          milestone 1
          sh 'npm run build:dev'
        }
      }

      stage('Development deploy') {
        // TODO: Switch to "== dev"
        // TODO: Mark stage as "NOT_BUILT", when available outside Blue Ocean
        if (env.BRANCH_NAME != 'master') {
          milestone 2
          lock(resource: 'dev-server', inversePrecedence: true) {
            milestone 3
            sh './deploy.dev.sh'
          }
        }
      }

    }
  }

  stage('Prepare production deploy') {
    if (env.BRANCH_NAME != 'master') {
      milestone 4
      slack.sendMessage(
        SlackColours.GOOD.colour,
        "${currentBuild.getFullDisplayName()} - Waiting for input (${utils.getBuildLink(env)})"
      )
      input 'Deploy to production?'
      milestone 5

      node {
        dockerEnv.inside {
          sh 'npm run build:prod'
        }
      }
    }
  }

  node {
    dockerEnv.inside {
      stage('Production deploy') {
        if (env.BRANCH_NAME != 'master') {
          milestone 6
          lock(resource: 'prod-server', inversePrecedence: true) {
            milestone 7
            sh './deploy.prod.sh'
          }
        }
      }
    }
  }

} catch (err) {
  currentBuild.result = 'FAILURE'
  throw err
} finally {
  stage('Post build actions') {
    slack.notify(currentBuild, currentBuild.result, env)
  }
}

