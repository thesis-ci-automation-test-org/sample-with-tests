pipeline {
    agent docker: "digitallyseamless/nodejs-bower-grunt:latest"

    properties {
        buildDiscarder(logRotator(numToKeepStr:'5'))
    }

    stages {
        stage("Build") {
            steps {
                sh "npm run dependencies"
            }
        }

        stage("Test") {
            steps {
                sh "grunt unit"
            }
        }
    }

    post {
        always {
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'test-results/html',
                reportFiles: 'index.html',
                reportName: "Coverage report"
            ])
            junit "test-results/**/unit-test-results.xml"
        }

        success {
            echo "This will run on success"
            notifySlack('SUCCESS') // TODO: Get from currentBuild
        }

        failure {
            echo "This will run on failure"
            notifySlack('FAILURE')
        }
    }
}

def notifySlack(result = 'FAILURE') {
    def msg = "${currentBuild.getFullDisplayName()} - Build failed!"
    def color = "danger"
    if (result == 'SUCCESS') {
        msg = "${currentBuild.getFullDisplayName()} - Build successful"
        color = "good"
    }

    msg += " (<${env.BUILD_URL}|Open>)"

    msg += "\nTest Status:\n"
    msg += "Passed: TODO, Failed: TODO, Skipped: TODO"

    slackSend color: color, message: msg
    slackSend color: color, message: getChangeLogString()
}

def getChangeLogString() {
    def str = ""
    def changeLogSets = currentBuild.changeSets
    
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            str += "- ${entry.msg} [${entry.author}]\n"
        }
    }

    if (!str) {
        return "No Changes."
    } else {
        str = "${currentBuild.getFullDisplayName()} Changes:\n" + str
    }

    return str    
}

