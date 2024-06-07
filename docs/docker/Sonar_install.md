# SonarQube

## Run SonarQube Server From Docker Compose

```bash
docker-compose -f docker-compose/sonar/sonarqube.yml up
```

## Run SonarQube Server From Dockerfile

```bash
# Running local sonarqube server LTS
$> docker run -d --name sonarqube \
    -p 9000:9000 \
    -v sonarqube_data:/opt/sonarqube/data \
    -v sonarqube_extensions:/opt/sonarqube/extensions \
    -v sonarqube_logs:/opt/sonarqube/logs \
    sonarqube:lts-community

# Running local sonarqube server latest
$> docker run -d --name sonarqube \
    -p 9000:9000 \
    -v sonarqube_data:/opt/sonarqube/data \
    -v sonarqube_extensions:/opt/sonarqube/extensions \
    -v sonarqube_logs:/opt/sonarqube/logs \
    sonarqube:community
```

## Run SonarQube Scanner

```bash
# Installing node dependencies && running tests
$> npm i
$> npm run test:cov

# Building sonar scanner client image
$> docker build -f docker-compose/sonar/Dockerfile.sonarScanner -t sonar/scanner-client:latest .

# Uploading local sonar scanner report to sonarqube server
docker run --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000' --user="$(id -u):$(id -g)" -v "$PWD:/src" \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=${PROJECT_NAME}" \
    -e SONAR_LOGIN="${SONAR_APP_TOKEN}" \
    sonar/scanner-client:latest

# Final exampple
docker run --network=host -e SONAR_HOST_URL='http://127.0.0.1:9000' --user="$(id -u):$(id -g)" -v "$PWD:/src" \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=nestjs-architecture-ms" \
    -e SONAR_LOGIN="sqp_123123123" \
    sonar/scanner-client:latest
```
