pipeline {
    //agent dockerfile: "Dockerfile.test"
    agent label: ""

    stages {
        stage("Docker") {
            steps {
                docker.build('thesis-ci-automation-test-org/sample-with-tests', '.')
            }
        }

        stage("Build") {
            steps {
                sh "npm install"
            }
        }

        stage("Test") {
            steps {
                sh "npm test -- --coverage"
            }
        }
    }

    post {
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
    // TODO: Send test results

    slackSend color: color, message: msg
    slackSend color: color, message: getChangeLogString()
}

def getChangeLogString() {
    def str = ""
    def changeLogSets = currentBuild.changeSets
    echo "${changeLogSets}"
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

