#!/usr/bin/env groovy

@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*

node {
    try {
        stage('Build') {
            checkout scm
            echo GitHelper.getChangeLogString(this)
        }
    } catch (e) {
        echo "BUILD FAILED!"
        NotifySlack.notify(this, steps, currentBuild.getResult())
    } finally {
        NotifySlack.notify(this, steps, currentBuild.getResult())
    }
}
