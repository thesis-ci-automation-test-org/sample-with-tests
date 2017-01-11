@Library('github.com/thesis-ci-automation-test-org/sample-shared-libs@dev')
import getChangelogString

pipeline {
    agent any
    stages {
        stage ('prepare') {
            steps {
                getChangelogString()
            }
        }
    }
}
