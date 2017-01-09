#!/usr/bin/env groovy
@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*

def err = null
currentBuild.result = 'SUCCESS'

try {
    node {
        stage('Build') {
            checkout scm
            //sh 'npm run dependencies'
        }

        stage('Test') {
            echo 'TESTING'
            //sh 'grunt unit'
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
