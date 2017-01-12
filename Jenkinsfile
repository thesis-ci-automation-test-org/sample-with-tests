#!/usr/bin/env groovy
@Library('thesisSampleLib')
import org.thesis_ci_automation_test.*

def slack = new SlackNotifier()
def utils = new Utils()

properties([buildDiscarder(logRotator(numToKeepStr: '5'))])

try {

  node {
    docker.build('sample-with-tests_build', '-f Dockerfile.test .').inside {

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
      
      stage('Prepare production deploy') {
        if (env.BRANCH_NAME != 'master') {
          milestone 4
          sh 'npm run build:prod'
        }
      }
      
      stage('Production deploy') {
        if (env.BRANCH_NAME != 'master') {
          milestone 5
          slack.sendMessage(
            SlackColours.GOOD.colour,
            "${currentBuild.getFullDisplayName()} - Waiting for input (${utils.getBuildLink(env)})"
          )
          input 'Deploy to production?'
          lock(resource: 'prod-server', inversePrecedence: true) {
            milestone 6
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

