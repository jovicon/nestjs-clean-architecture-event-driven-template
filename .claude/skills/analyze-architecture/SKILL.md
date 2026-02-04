---
name: analyze-architecture
description: Analyze NestJS project architecture against Clean Architecture, DDD, and best practices. Use when reviewing code structure, checking layer boundaries, validating architectural patterns, or auditing module compliance.
argument-hint: [module-name] [focus-area]
---

Perform a comprehensive architectural analysis of the NestJS project.

**Module to analyze:** $0 (if empty, analyze entire project)
**Focus area:** $1 (options: structure, dependencies, ddd, events, all - default: all)

## Analysis Scope

The analysis will cover the specified focus area or complete architecture review if "all" is selected.

### 1. Clean Architecture Layer Validation

Check for proper layer separation and dependency rules:

**A. Domain Layer (Pure Business Logic)**
- ✅ Verify domain entities/aggregates have NO framework imports
- ✅ Check that domain code only imports from `@shared/ddd` and `@shared/commons`
- ✅ Validate entities extend `Entity<T>` or `AggregateRoot<T>`
- ✅ Ensure value objects extend `ValueObject<T>`
- ✅ Verify domain events are pure data classes (no decorators like @Injectable)
- ❌ Flag any NestJS decorators (@Injectable, @Module, etc.) in domain layer
- ❌ Flag any database imports (Mongoose, TypeORM, etc.) in domain layer
- ❌ Flag any HTTP/transport layer imports in domain

**B. Application Layer (Use Cases & Orchestration)**
- ✅ Verify use cases implement `UseCase<IRequest, IResponse>` interface
- ✅ Check use cases return `Result<T>` or `Either<L, R>`
- ✅ Validate port interfaces are defined (not concrete implementations)
- ✅ Verify event handlers use @OnEvent decorator (application layer, not domain)
- ✅ Check DTOs have proper validation decorators
- ❌ Flag any direct database model usage (should use ports/interfaces)
- ❌ Flag business logic in use cases (should be in domain entities)

**C. Adapters Layer (Infrastructure Implementations)**
- ✅ Verify adapters implement port interfaces from application layer
- ✅ Check repository adapters extend base repository patterns
- ✅ Validate database schemas are separated from domain entities
- ✅ Ensure proper mapping between domain and persistence models
- ❌ Flag adapters with business logic (should be in domain)

**D. Infrastructure Layer (DI Wiring)**
- ✅ Verify modules only perform dependency injection configuration
- ✅ Check that infrastructure connects ports to adapter implementations
- ❌ Flag business logic in infrastructure modules

### 2. Domain-Driven Design Pattern Analysis

**A. Aggregates & Entities**
- ✅ Verify aggregates use `AggregateRoot<T>` base class
- ✅ Check entities have private constructors with static `create()` factory methods
- ✅ Validate entities use `Guard` pattern for validation
- ✅ Ensure entities return `Result<Entity>` from create methods
- ✅ Check that aggregates control transaction boundaries
- ✅ Verify business logic is encapsulated in domain entities (not anemic models)
- ❌ Flag public constructors (should be private with factory methods)
- ❌ Flag getters/setters without business logic (anemic domain model anti-pattern)

**B. Value Objects**
- ✅ Verify immutability (no setters)
- ✅ Check equality based on values, not identity
- ✅ Validate self-validation in create() method
- ❌ Flag mutable value objects

**C. Domain Events**
- ✅ Check domain events extend `DomainEvent` base class
- ✅ Verify events are in `domain/events/` directory
- ✅ Validate event handlers are in `application/events/handlers/`
- ✅ Ensure domain events are pure data (no framework decorators)
- ✅ Check that aggregates properly publish events via `addDomainEvent()`
- ❌ Flag framework decorators in domain events (@Injectable, @OnEvent)
- ❌ Flag business logic in event handlers (should delegate to domain)

**D. Ubiquitous Language**
- ✅ Check naming consistency (entity names match business concepts)
- ✅ Verify method names use domain language
- ❌ Flag technical jargon instead of business terminology

### 3. Dependency Rule Enforcement

Analyze import statements to ensure:
- Domain layer NEVER imports from: application, adapters, infrastructure, any framework
- Application layer NEVER imports from: adapters, infrastructure
- Adapters layer can import from: domain, application, shared
- Infrastructure layer can import from: all layers (for wiring only)

**Provide violations with:**
- File path and line number
- Incorrect import statement
- Which layer boundary was violated
- Recommended fix

### 4. Module Structure Compliance

Verify each module follows the template structure:

```
module_name/
├── domain/                 # Pure business logic
│   ├── [entities]
│   ├── [value-objects]
│   └── events/
├── application/            # Use cases
│   ├── ports/             # Interfaces
│   ├── events/handlers/   # Event reactions
│   ├── useCases/
│   └── ms/                # Entry points (HTTP/WebSocket/TCP)
├── adapters/              # Implementations
│   └── repository/
└── infrastructure/        # DI wiring
    └── [module].module.ts
```

Flag any deviations from this structure.

### 5. Code Quality Checks

**A. Error Handling**
- ✅ Verify use of Result/Either pattern instead of exceptions
- ❌ Flag try-catch blocks in use cases (should use Result pattern)
- ❌ Flag thrown exceptions in domain logic

**B. Validation**
- ✅ Check Guard pattern usage at domain boundaries
- ✅ Verify DTO validation decorators
- ❌ Flag missing input validation

**C. Testing**
- ✅ Check for corresponding test files (*.spec.ts)
- ✅ Verify test coverage for use cases
- ❌ Flag use cases without tests

### 6. Event-Driven Architecture

**A. Event Flow**
- ✅ Verify proper event publishing from aggregates
- ✅ Check event handler registration in modules
- ✅ Validate asynchronous event processing
- ❌ Flag synchronous coupling between services

**B. Choreography Pattern**
- ✅ Check for saga pattern implementation (if applicable)
- ✅ Verify loose coupling between services
- ❌ Flag tight coupling via direct service calls

### 7. Anti-Pattern Detection

Flag common architectural anti-patterns:
- ❌ **Anemic Domain Model** - Entities with only getters/setters, no behavior
- ❌ **God Objects** - Classes with too many responsibilities
- ❌ **Layer Leakage** - Framework code in domain layer
- ❌ **Transaction Script** - Business logic in use cases instead of domain
- ❌ **Primitive Obsession** - Using primitives instead of value objects
- ❌ **Feature Envy** - Methods that use more data from other classes
- ❌ **Shotgun Surgery** - Single change requires modifications across many classes

### 8. Performance & Best Practices

- ✅ Check for proper dependency injection usage
- ✅ Verify singleton vs transient scope appropriateness
- ✅ Check for N+1 query issues in repositories
- ✅ Validate caching strategy (if applicable)

## Output Format

Provide a structured report with:

### 📊 Architecture Score
- Overall compliance score (0-100%)
- Layer separation score
- DDD patterns score
- Code quality score

### ✅ Strengths
List what's well-implemented

### ⚠️ Violations & Issues
For each issue:
- **Severity**: Critical / High / Medium / Low
- **Category**: Clean Architecture / DDD / Code Quality
- **Location**: File path and line number
- **Issue**: Description of the problem
- **Impact**: Why this matters
- **Recommendation**: How to fix it
- **Example**: Code snippet showing the fix

### 🎯 Recommendations
Prioritized list of improvements:
1. Critical fixes (breaks architectural principles)
2. Important improvements (technical debt)
3. Nice-to-have enhancements

### 📈 Metrics
- Total files analyzed
- Layer distribution
- Dependency violations count
- Test coverage gaps
- Cyclomatic complexity warnings

### 🔍 Deep Dive (if specific module analyzed)
Module-specific analysis with detailed code review

---

**Analysis Guidelines:**
- Be thorough but practical
- Focus on architectural impact, not nitpicks
- Provide actionable recommendations
- Reference specific files and line numbers
- Compare against the Order module as the reference implementation
- Consider the project maturity and context
