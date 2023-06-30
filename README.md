# Typescript Nest js Clean Architecture Template

Node web server running over Express for a Rest API

## Que es clean architecture

Clean architecture es un conjunto de principios cuya finalidad principal es ocultar los detalles de implementación a la lógica de dominio de la aplicación.

De esta manera mantenemos aislada la lógica de negocios, consiguiendo tener un código mucho más mantenible y escalable en el tiempo.

<img src="/assets/clean-architecture.png" alt="Alt text" title="clean-architecture">

## Porque Clean Architecture?

La finalidad de clean architecture es que la aplicación sea más sencilla de mantener y escalar en el tiempo, además que la logica de negocio no se vea afectada por detalles, implementaciones o elementos externos.

## Pilares para Clean Architecture

La arquitectura clean se basa en los tres siguientes pilares:

- **Domain Driven Design**: los detalles de implementación de la lógica de dominio deben estar separados de implementaciónes, detalles o adaptadores de cualquier tipo, como infraestructura, frameworks, UI entre otros.

- **Modular Architecture**: se basa en que los módulos de la aplicación sean independientes y que sean capaces de ser reutilizados, dichos modulos pueden ser utilidades compartidas, Guards, Adaptadores, Factories.

- **Test Driven Development**: Este pilar se basa en que los tests de la aplicación sean capaces de probar la lógica de dominio de la aplicación.

## Buenas practicas recomendadas

- **Clean Code**: [Clean Code](https://www.freecodecamp.org/news/clean-coding-for-beginners/)

- **Patrones SOLID**: [Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)

- **Dependecy Inversion**: [Dependency Injection](https://www.freecodecamp.org/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it-7578c84fa88f/)

- **Design Patterns**: [Design Patterns - best approach](https://refactoring.guru/es/design-patterns)

- **Repository Pattern**: [Implementing a generic repository Pattern](https://betterprogramming.pub/implementing-a-generic-repository-pattern-using-nestjs-fb4db1b61cce)

## Instalación del template

```bash
npm i && npm run prepare
```

## Description

Las carpetas principales propuestas para el proyecto son:

- **shared**: carpeta donde se encuentran todos modulos reutilizables que sean utilidades compartidas.
- **modules**: carpeta donde se encuentran todos los modulos de la aplicación, incluyendo, casos de uso, adaptadores y dominio.

### Estructura interna de la carpeta shared

```
shared/
  - adapters/
  - application/
  - domain/
  - common/
  - core/
  - utils/
  - constants/
```

### Estructura interna de la carpeta modules

```
modules/
  - module_name (ej: users)
    - adapters/
    - application/
      - infrastructure_application (ej: http - queue - daemon - jobs)
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

## Fuentes de información

- [La base de Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Flujo y detalle de Clean Architecture](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together)
- [Puertos y Adaptadores](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
- [Porque Clean Architecture](https://xurxodev.com/por-que-utilizo-clean-architecture-en-mis-proyectos/)
- [Clean Architecture en Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)
- [Full Clean Architecture Explained](https://docs.google.com/drawings/d/1E_hx5B4czRVFVhGJbrbPDlb_JFxJC8fYB86OMzZuAhg/edit)

## API usada para el template

- [API Formula uno](http://ergast.com/mrd/methods/seasons/)

## Versionado 📌:

- Ocupar [SemVer](http://semver.org/) para el versionado semantico.

## Rules 📢:

### Nomenclatura Ramas:

- feature-\*

- **release** _----> Protegida_

- hotfix-\*

- **develop** _----> Protegida_

- **main** _----> Protegida_

#### Ejemplo:

```
Feature-login-re-v1-1
```

#### Rules:

```
No se permiten mayúsculas

No se permiten guiones bajos

No se permiten espacios

No se permiten caracteres especiales ($#&%?¿)
```

### REGEX Ramas:

```
(((feature|release|hotfix){1}-{1})\/*([a-z|0-9|-]*)$)|develop|release|main
```

### REGEX TAGs:

```
/^main-v\d+\.\d+\.\d+$
```

## Mas Información 📖

Si necesitas mas información la puedes encontrar en:

- [KB DevOps/Sre: Nomenclatura de repositorios GIT](https://gruposurachile.sharepoint.com/:w:/s/EquipoDevOpsSRE/EZ2FU8u2AStEs-_uRKacW5MBaGcAW-q-XSpIwIuUVTvmfQ?e=esZwnf)
- [Tutorial flujo de trabajo Gitflow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow)
