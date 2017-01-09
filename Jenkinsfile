#!/usr/bin/env groovy

@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@master')
import org.thesis_ci_automation_test.*

node {
    stage('Build') {
        checkout scm
        echo "asdasd"
        echo GitHelper.getChangeLogString(this)

        SlackNotifier.notify(this, steps, currentBuild.getResult().toString())
    }
}
