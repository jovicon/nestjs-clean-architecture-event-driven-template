#!/usr/bin/env groovy
def jenkinsFile
stage('Loading Jenkins file') {
  jenkinsFile = fileLoader.fromGit('jf_green.groovy', 'https://github.com/AFP-Capital/jenkins-pipeline-files.git', 'generic', 'devops-github', '')
}