#!/usr/bin/env groovy
@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*
import org.jenkinsci.plugins.workflow.steps.FlowInterruptedException

def err = null
currentBuild.result = 'SUCCESS'

// Only keep the 5 most recent builds.
def projectProperties = [
    [$class: 'BuildDiscarderProperty',strategy: [$class: 'LogRotator', numToKeepStr: '5']],
]
properties(projectProperties)

try {
    node {
        stage('Prepare environment') {
            checkout scm
        }

        docker.build('thesis-ci-automation-test-org/sample-with-tests:${env.BUILD_NUMBER}', '-f Dockerfile.test').inside {
            stage('Build') {
                sh 'npm run dependencies'
            }

            stage('Test') {
                sh 'grunt unit'
                junit 'test-results/**/unit-test-results.xml'
            }

            stage('Dev deploy') {
                sh './deploy.dev.sh'
            }

            stage('Production deploy') {
                milestone 1
                input 'Does dev look good?'
                milestone 2
                sh './deploy.prod.sh'
            }
        }
    }
} catch (FlowInterruptedException e) {
    err = e
    currentBuild.result = 'ABORTED'
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
