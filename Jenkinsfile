#!/usr/bin/env groovy
@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*

def err = null
currentBuild.result = 'SUCCESS'

try {
    node {
        stage('Prepare environment') {
            checkout scm
        }

        docker.image('digitallyseamless/nodejs-bower-grunt:latest').inside {
            stage('Build') {
                sh 'npm run dependencies'
            }

            stage('Test') {
                sh 'grunt unit'
                junit "test-results/**/unit-test-results.xml"
            }
        }
    }
} catch (e) {
    err = e
    currentBuild.result = 'FAILURE'
} finally {
    SlackNotifier.notify(this, steps, currentBuild.getResult().toString())

    // Must re-throw exception to propagate error
    if (err) {
        throw err
    }
}
