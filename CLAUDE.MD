# CLAUDE.MD - NestJS Clean Architecture Event-Driven Template

This document helps AI assistants understand and work effectively with this codebase.

## Project Overview

**Type:** NestJS Clean Architecture Event-Driven Microservices Template
**Version:** 1.8.1
**Repository:** <https://github.com/jovicon/nestjs-clean-architecture-event-driven-template>
**Primary Language:** TypeScript 5.5.2
**Framework:** NestJS 10.3.8

This is a production-ready template implementing Clean Architecture, Domain-Driven Design (DDD), and Event-Driven patterns for building scalable microservices.

## Core Architecture Principles

### Clean Architecture Layers

The codebase strictly follows Clean Architecture with three main layers:

1. **Domain Layer** (`modules/*/domain/`)
   - Pure business logic
   - Entities, Aggregates, and Value Objects
   - Domain Events
   - Zero framework dependencies

2. **Application Layer** (`modules/*/application/`)
   - Use Cases (business workflows)
   - DTOs for request/response contracts
   - Port definitions (interfaces for infrastructure)
   - Organized into: `useCases/` and `ms/` (microservice infrastructure)

3. **Adapter/Infrastructure Layer** (`modules/*/adapters/` + `shared/adapters/`)
   - Repository implementations
   - External service integrations
   - Database, cache, HTTP adapters

### Dependency Rule

Dependencies flow inward only: Infrastructure → Application → Domain. The domain layer must never depend on outer layers.

## Directory Structure

```bash
/src/
├── config/                          # Configuration providers
│   └── providers/
│       ├── database.config.ts       # MongoDB connection
│       ├── microservice.config.ts   # Service discovery
│       └── logger.module.config.ts  # Logger configuration
├── modules/                         # Feature modules (business domains)
│   ├── order/                       # Order module (main example)
│   ├── products/                    # Product module
│   └── logger/                      # Logging service
└── shared/                          # Shared utilities & infrastructure
    ├── adapters/                    # External service integrations
    │   ├── repository/              # Database adapters (MongoDB, Elasticsearch)
    │   ├── cache/                   # Redis caching layer
    │   ├── http/                    # HTTP client (Axios)
    │   └── ports/                   # Port interface definitions
    ├── application/                 # Application-wide utilities
    │   ├── context/                 # Request context management
    │   ├── types/                   # Type definitions
    │   └── interfaces/              # Common interfaces
    ├── commons/                     # Common utilities
    │   ├── core/                    # Core abstractions (Result, UseCase, Events)
    │   └── Guard.ts                 # Input validation helper
    └── ddd/                         # DDD base abstractions
        ├── Entity.ts                # Base entity class
        ├── AggregateRoot.ts         # Aggregate root with event publishing
        ├── ValueObject.ts           # Value object pattern
        ├── DomainEvent.base.ts      # Domain event base class
        └── UniqueEntityID.ts        # Entity identifier
```

## Technology Stack

### Core Technologies

- **NestJS 10.3.8** - Application framework
- **TypeScript 5.5.2** - Primary language
- **Node.js** - Runtime environment

### Databases & Storage

- **MongoDB** with Mongoose 8.3.2 - Primary database
- **Elasticsearch 8.13.1** - Log aggregation and search
- **Redis** via Keyv 5.1.3 - Caching layer

### Microservices & Communication

- **@nestjs/microservices** - TCP and transport protocols
- **Socket.io 4.7.5** - Real-time WebSocket communication
- **@nestjs/axios 3.0.2** - HTTP client for external APIs
- **@nestjs/event-emitter 2.0.4** - Event-driven architecture

### Observability

- **Winston 3.13.0** with nest-winston - Structured logging
- **Elasticsearch** - Log aggregation
- **SonarQube** - Code quality metrics

### Development Tools

- **Jest 29.7.0** - Testing framework
- **ESLint** - Code linting (Airbnb style guide)
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Swagger/OpenAPI** - API documentation

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **Serverless Framework** - AWS Lambda/Vercel deployment support

## Key Design Patterns

### 1. Use Case Pattern

Every business operation is a use case implementing this interface:

```typescript
interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
```

**Location:** `modules/*/application/useCases/*/[UseCaseName].usecase.ts`

**Structure:** Each use case has:

- `[UseCaseName].usecase.ts` - Implementation
- `[UseCaseName].dto.ts` - Request/Response DTOs
- `[UseCaseName].module.ts` - NestJS module

### 2. Result/Either Pattern

Functional error handling instead of exceptions:

```typescript
Result<T> // Success or failure wrapper
Either<L, A> // Left (error) or Right (success)

// Usage
const result = await someUseCase.execute(dto);
if (result.isFailure) {
  return result.getErrorValue();
}
return result.getValue();
```

**Location:** `shared/commons/core/Result.ts`, `shared/commons/core/Either.ts`

### 3. Guard Pattern

Input validation at domain boundaries:

```typescript
Guard.againstNullOrUndefined(value, 'fieldName');
Guard.isArray(value, 'fieldName');
Guard.combine([guard1, guard2, guard3]);
```

**Location:** `shared/commons/Guard.ts`

### 4. Entity & Aggregate Pattern

**Entities:**

- Extend `Entity<T>` with unique IDs
- Private constructors with static factory methods (`create()`)
- Location: `modules/*/domain/[entity].ts`

**Aggregates:**

- Extend `AggregateRoot<T>` for event publishing
- Control transaction boundaries
- Publish domain events
- Location: `modules/*/domain/[aggregate].ts`

**Value Objects:**

- Extend `ValueObject<T>`
- Immutable, identified by values not ID
- Location: `modules/*/domain/[valueobject].ts`

### 5. Domain Events Pattern

**Event Flow:**

1. Domain action occurs (e.g., order created)
2. Aggregate adds event to pending events: `this.addDomainEvent(new OrderCreatedEvent(...))`
3. Use case publishes events after persistence
4. Event handlers react asynchronously

**Locations:**

- Event definitions: `modules/*/domain/events/emitters/`
- Event handlers: `modules/*/domain/events/handlers/`

**Example:**

```typescript
// In Aggregate
this.addDomainEvent(new OrderCreatedEvent(this.id, this.customerId));

// Handler
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  async handle(event: OrderCreatedEvent) {
    // React to event
  }
}
```

### 6. Repository Pattern

Generic repository interface with MongoDB and Elasticsearch implementations:

```typescript
interface IRepository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T>;
  delete(id: string): Promise<void>;
}
```

**Location:** `shared/adapters/repository/`

### 7. Choreography-Based Sagas

Event-driven microservice orchestration:

- No central coordinator
- Services react to domain events
- Loose coupling between services
- Example: OrderCreated → CustomerValidation → OrderApproved/Rejected

**Documentation:** `_docs/microservice_labs/` directory

## Module Structure Template

Each feature module follows this consistent structure:

```bash
module_name/
├── domain/
│   ├── [aggregate].ts              # Main business entity
│   ├── [valueobject].ts            # Value objects
│   └── events/
│       ├── emitters/               # Domain event definitions
│       └── handlers/               # Event listeners
├── adapters/
│   └── repository/                 # Data access implementations
│       ├── [entity].repository.ts
│       └── [entity].schema.ts      # Database schema
└── application/
    ├── useCases/
    │   └── [UseCase]/
    │       ├── [UseCase].usecase.ts
    │       ├── [UseCase].dto.ts
    │       └── [UseCase].module.ts
    └── ms/                         # Microservice entry points
        ├── http/                   # REST API controllers
        ├── websocket/              # WebSocket gateways
        └── tcp/                    # TCP microservice controllers
```

## Request Context & Tracing

**Request ID Propagation:**

- `RequestContextService` manages isolated request context using AsyncLocalStorage
- `ContextInterceptor` auto-injects unique request IDs (using `nanoid`)
- Access in any service: `RequestContextService.getRequestId()`
- Used for distributed tracing across microservices

**Location:** `shared/application/context/`

## Configuration System

**Pattern:** Factory pattern with async initialization

**Main Configurations:**

- `database` - MongoDB connection (`config/providers/database.config.ts`)
- `microservice` - Service discovery and ports (`config/providers/microservice.config.ts`)
- `loggerModule` - Logger service integration (`config/providers/logger.module.config.ts`)

**Environment Variables:**

- `MONGO_URL` - MongoDB connection string
- `ELASTICSEARCH_*` - Elasticsearch credentials
- `LOGGER_*` - Logger microservice settings
- Docker-aware: Uses `host.docker.internal` when needed

## Development Workflow

### Common Commands

```bash
# Development
npm run start:dev              # Hot reload development server

# Building
npm run build                  # Production build

# Testing
npm test                       # Run unit tests
npm run test:cov              # Coverage report
npm run test:e2e              # End-to-end tests

# Code Quality
npm run lint                   # ESLint with auto-fix
npm run format                 # Prettier formatting

# Docker
docker-compose -f docker/mongo.yml up           # MongoDB
docker-compose -f docker/elasticstack.yml up    # Elasticsearch stack
```

### Testing Conventions

- Test files: `*.spec.ts` pattern
- Jest configuration in `jest.config.js`
- SonarQube integration with jest-sonar reporter
- Coverage reports: `./coverage` directory
- Path aliases configured for test imports

## Code Quality Standards

### Principles

- **SOLID** principles enforced
- **Clean Code** practices
- **Domain-Driven Design** patterns
- **Test-Driven Development** encouraged
- **Dependency Inversion** strictly followed

### Tools & Configuration

- ESLint with Airbnb style guide
- Prettier for consistent formatting
- SonarQube for static analysis
- Husky pre-commit hooks

## Communication Patterns

### HTTP REST APIs

- Controllers in `modules/*/application/ms/http/`
- Swagger/OpenAPI documentation
- DTOs for request/response validation

### WebSockets

- Gateways in `modules/*/application/ms/websocket/`
- Socket.io integration
- Real-time bidirectional communication

### TCP Microservices

- Controllers in `modules/*/application/ms/tcp/`
- NestJS microservice transport
- Inter-service communication

### Domain Events

- Event emitters in `modules/*/domain/events/emitters/`
- Event handlers in `modules/*/domain/events/handlers/`
- Asynchronous, decoupled communication

## Important Conventions

### Naming Conventions

- **Use Cases:** `[Action][Entity].usecase.ts` (e.g., `CreateOrder.usecase.ts`)
- **DTOs:** `[UseCase].dto.ts`
- **Entities:** PascalCase, singular (e.g., `Order.ts`)
- **Events:** `[Entity][Action]Event.ts` (e.g., `OrderCreatedEvent.ts`)
- **Repositories:** `[Entity].repository.ts`

### File Organization

- Group by feature/module, not by technical layer
- Each use case is self-contained with its module
- Shared code in `shared/` directory only when truly reusable

### Error Handling

- Use Result/Either pattern, not exceptions
- Domain errors extend `DomainError`
- Application errors use appropriate HTTP status codes
- Never expose internal errors to clients

## Working with This Codebase

### Adding a New Feature Module

1. Create module directory: `src/modules/[feature]/`
2. Implement domain layer:
   - Aggregates/Entities
   - Value Objects
   - Domain Events
3. Define application ports (interfaces)
4. Implement use cases
5. Create adapters (repository, external services)
6. Add microservice entry points (HTTP/WebSocket/TCP)

### Adding a New Use Case

1. Create directory: `src/modules/[module]/application/useCases/[UseCase]/`
2. Create files:
   - `[UseCase].usecase.ts` - Implementation
   - `[UseCase].dto.ts` - Request/Response DTOs
   - `[UseCase].module.ts` - NestJS module
3. Inject required ports/repositories
4. Implement `execute()` method returning `Result<T>`
5. Register in module's main module file

### Adding Domain Events

1. Create event: `src/modules/[module]/domain/events/emitters/[Event].ts`
2. Extend `DomainEvent` base class
3. Add event to aggregate: `this.addDomainEvent(new MyEvent(...))`
4. Create handler: `src/modules/[module]/domain/events/handlers/[EventHandler].ts`
5. Use `@EventsHandler(MyEvent)` decorator
6. Register handler in module

## Documentation Resources

The `_docs/` directory contains:

- `clean_architecture.md` - Architecture principles
- `Instrunctions-development.md` - Setup guide
- `Technologies-&-Architecture.md` - Tech stack details
- `versioning-gitflow.md` - Git workflow
- `APIs.md` - External API integrations
- `code_review.md` - Review guidelines
- `docker/` - Infrastructure setup
- `microservice_labs/` - Saga pattern examples

## Key Files Reference

### Core Abstractions

- `shared/ddd/Entity.ts` - Base entity class
- `shared/ddd/AggregateRoot.ts` - Aggregate root with events
- `shared/ddd/ValueObject.ts` - Value object base
- `shared/commons/core/Result.ts` - Result pattern
- `shared/commons/core/UseCase.ts` - Use case interface
- `shared/commons/Guard.ts` - Validation guards

### Infrastructure folder

- `shared/adapters/repository/` - Repository implementations
- `shared/adapters/cache/` - Caching layer
- `shared/adapters/http/` - HTTP client
- `shared/application/context/` - Request context

### Configuration

- `config/providers/database.config.ts` - Database setup
- `config/providers/microservice.config.ts` - Service config
- `.env` - Environment variables

## Best Practices for AI Assistants

1. **Always respect layer boundaries** - Domain code should never import from application or infrastructure layers
2. **Use existing patterns** - Follow the established use case, repository, and event patterns
3. **Validate at boundaries** - Use Guard pattern for input validation
4. **Return Results, not exceptions** - Use Result/Either for error handling
5. **Keep use cases thin** - Business logic belongs in domain entities/aggregates
6. **Follow module structure** - Maintain consistency with existing modules
7. **Write tests** - Every use case should have corresponding test files
8. **Document events** - Domain events are critical for understanding system behavior
9. **Check existing documentation** - Review `_docs/` before implementing patterns
10. **Respect SOLID principles** - Especially dependency inversion

## Current State

Recent development focus (based on latest commits):

- Redis configuration enhancements
- Use case pattern upgrades
- Implementation of new use case patterns

This is an actively maintained template suitable for production use.
