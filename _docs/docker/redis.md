# Redis - Docker commands

## 1. Docker and Docker Compose Running with Redis

```bash
➜ $ sudo docker build --no-cache -t redis:latest -f docker/redis/Dockerfile.redis .
```

```bash
➜ $ sudo docker run -d --name redis -p 6379:6379 redis:latest
```

```bash
➜ $ sudo docker ps
```

```bash
➜ $ sudo docker exec -it redis redis-cli
```

```bash
➜ $ sudo docker stop redis
```

```bash
➜ $ sudo docker rm redis
```

```bash
➜ $ sudo docker rmi redis:latest
```

```bash
➜ $ sudo docker-compose -f docker/redis/docker-compose.yml up -d
```

```bash
➜ $ sudo docker-compose -f docker/redis/docker-compose.yml down
```

```bash
➜ $ sudo docker-compose -f docker/redis/docker-compose.yml ps
```

```bash
➜ $ sudo docker-compose -f docker/redis/docker-compose.yml exec redis redis-cli
```

```bash
➜ $ sudo docker-compose -f docker/redis/docker-compose.yml stop
```
