# Dockers Run

## Dockers

### Docker Base

```bash
sudo docker build -t nest-js-architecture-app:latest -f Dockerfile .

sudo docker run -it --rm -p 3000:3000 nest-js-architecture-app:latest --network="host"

# Docker Scout
docker scout cves local://nest-js-architecture-app:latest

docker scout recommendations local://nest-js-architecture-app:latest
```

### Dockerfile Node

```bash
docker build -t nest-js-architecture-app-node:latest -f docker/Dockerfile.node .

docker run -it --rm -p 3000:3000 nest-js-architecture-app-node:latest

# Docker Scout 
docker scout cves local://nest-js-architecture-app-node:latest

docker scout recommendations local://nest-js-architecture-app-node:latest
```

### Dockerfile Bun

```bash
docker build --no-cache -t nest-js-architecture-app-bun:latest -f docker/Dockerfile.bun .

docker run -it --rm -p 3000:3000 nest-js-architecture-app-bun:latest

# Docker Scout 
docker scout cves local://nest-js-architecture-app-bun:latest

docker scout recommendations local://nest-js-architecture-app-bun:latest
```

## Docker Compose

Run this commands from base repo project to get up project container needs

### Elastic Stack

```bash
docker-compose -f docker/elasticstack.yml up
```

### Mongo

```bash
docker-compose -f docker/mongo.yml up
```

### Kafka

```bash
docker-compose -f docker/kafka.yml up
```
