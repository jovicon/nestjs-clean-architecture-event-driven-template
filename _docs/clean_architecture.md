# Clean Architecture

## What is clean architecture?

Clean architecture is a set of principles whose main purpose is to hide implementation details from the application domain logic.

This architecture is based on the separation of concerns, where the business logic is the most important part of the application.

![Basic Clean Architecture diagram](/_docs/assets/basic-clean-architecture.png "Clean Architecture diagram")

## Why use clean architecture?

The purpose of clean architecture is that the application is easier to maintain and scale over time, and that the business logic is not affected by details, implementations or external elements.

## Pillars for Clean Architecture

This Clean architecture template is based on the following three pillars:

- **Domain Driven Design**: The implementation details of the domain logic should be separated from implementations, details or adapters of any kind, such as infrastructure, frameworks, UI, among others.

- **Module Architecture**: This pillar is based on the idea that the modules of the application should be independent and that they should be able to be reused. These modules can be shared utilities, Guards, Adapters, Factories.

- **Evolutionary Architectures**: This pillar is based on the idea that the architecture of the application should be able to evolve over time, and that it should be able to adapt to new requirements or changes in the business logic.

## Helper pillars

- **Test Driven Development**: This pillar is based on the idea that the tests of the application should be able to test the domain logic of the application.

## Recommended best practices

- **Clean Code**: [Clean Code](https://www.freecodecamp.org/news/clean-coding-for-beginners/)

- **SOLID principles**: [Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)

- **Dependency Inversion**: [Dependency Injection](https://www.freecodecamp.org/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it-7578c84fa88f/)

- **Design Patterns**: [Design Patterns - best approach](https://refactoring.guru/es/design-patterns)

- **Repository Pattern**: [Implementing a generic repository Pattern](https://betterprogramming.pub/implementing-a-generic-repository-pattern-using-nestjs-fb4db1b61cce)

## Full example diagram

![Full Clean Architecture diagram](/_docs/assets/full-clean-architecture.png "Full Clean Architecture diagram")

## Caching with Clean Architecture

- [Caching with Clean Architecture diagram](https://www.linkedin.com/pulse/implementing-clean-architecture-adding-caching-layer-joel-ndoh-dkswf/)