#!/usr/bin/env groovy
@Library('thesisSampleLib')
import org.thesis_ci_automation_test.*

def slack = new SlackNotifier()
def utils = new Utils()

properties([buildDiscarder(logRotator(numToKeepStr: '5'))])

try {

  node {
    docker.image('digitallyseamless/nodejs-bower-grunt').inside {

      stage('Checkout') {
        deleteDir()
        checkout scm
      }
  
      stage('Build') {
        sh 'npm run dependencies'
      }

    }
  }

} catch (err) {
  currentBuild.result = 'FAILURE'

  slack.notify(currentBuild, currentBuild.result, env)

  throw err
}

