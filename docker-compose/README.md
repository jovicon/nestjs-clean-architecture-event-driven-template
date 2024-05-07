# Run Docker Compose

Run this commands from base repo project to get up project container needs

## Elastic Stack

```bash
docker-compose -f docker-compose/elasticstack.yml up
```

## Mongo

```bash
docker-compose -f docker-compose/mongo.yml up
```

## Kafka

```bash
docker-compose -f docker-compose/kafka.yml up
```

## SonarQube

```bash
docker-compose -f docker-compose/sonarqube.yml up
```