# Instructions for development && Getting Started 🚀

## 0. Prerequisites

- Node.js v20.13.1 or higher
- NPM v10.2.4 or higher
- NVM v0.39.1 or higher
- Docker Engine v26.1.1 or higher

## 0.1. Clone or fork the repository

```bash
➜ $ git clone $REPOSITORY_URL
```

## 1. Install the required packages

```bash
➜ $ npm i && npm run prepare
```

## 2. Docker and Docker Compose Running with mongoDB

```bash
➜ $ sudo docker-compose -f docker/mongo.yml up
```

## 3. Docker and Docker Compose Running with Elastic Stack

```bash
➜ $ sudo docker-compose -f docker/elasticstack.yml up
```

## 4. Copy the .env.example file to .env

```bash
➜ $ cp .env.example .env
```

## 5. Run the project

```bash
➜ $ npm run start:dev
```

## Folder Description

The main folders proposed for the project are:

- **shared**: folder where all reusable modules that are shared utilities are located.
- **modules**: folder where all the application modules are located, including use cases, adapters and domain.
- **config**: folder where all the configuration adapters files are located.

### Internal structure of the shared folder

```bin
shared/
  - adapters/
  - application/
  - core/
  - ddd/
  - common/
  - utils/
  - constants/
```

### Internal structure of the modules folder

```bin
modules/
  - module_name -- (eg: order)
    - adapters/
    - application/
      - ms
        - infrastructure_name -- (eg: http, tlc, queue, websocket, daemon, jobs)
      - usecases/
    - domain/
```

## App Plugins

### Development Tools

- NestJS
- TypeScript
- Axios
- Express
- Winston Logger

### Clean code plugins

- Prettier
- ESLint
- Airbnb Code style Guide
- SonarQube Pluggins (VS Code)

### Test plugins

- Jest
- Husky
- Talisman (to implement)
