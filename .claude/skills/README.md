# Custom Claude Code Skills

This directory contains custom skills for the NestJS Clean Architecture Event-Driven Template.

## Available Skills

### 1. `/create-module <module_name>`

Creates a complete feature module with Clean Architecture structure.

**Example:**

```text
/create-module payment
```

Creates the full directory structure:

- domain/ (entities, events)
- application/ (use cases, ports, event handlers)
- adapters/ (repository implementations)
- infrastructure/ (NestJS modules)

---

### 2. `/create-usecase <module_name> <usecase_name>`

Creates a new use case with DTOs and module files.

**Example:**

```text
/create-usecase order CreateOrder
```

Generates:

- `CreateOrder.usecase.ts` - Use case implementation
- `CreateOrder.dto.ts` - Request/Response DTOs
- `CreateOrder.module.ts` - NestJS module

---

### 3. `/create-domain-event <module_name> <event_name>`

Creates a domain event (pure data) and its handler (with framework decorators).

**Example:**

```text
/create-domain-event order OrderCreated
```

Generates:

- Domain event in `domain/events/OrderCreated.ts`
- Event handler in `application/events/handlers/OrderCreated.handler.ts`

---

### 4. `/create-entity <module_name> <entity_name> [is_aggregate]`

Creates a domain entity or aggregate root.

**Examples:**

```text
/create-entity order Order yes
/create-entity order OrderItem no
```

Generates domain entity with:

- Proper base class (Entity or AggregateRoot)
- Factory method pattern
- Guard validation
- Business logic encapsulation

---

### 5. `/create-value-object <module_name> <vo_name>`

Creates an immutable value object.

**Example:**

```text
/create-value-object order Money
```

Generates value object with:

- Immutability
- Value-based equality
- Self-validation
- Factory method

---

### 6. `/create-repository <module_name> <entity_name>`

Creates complete repository infrastructure.

**Example:**

```text
/create-repository order Order
```

Generates:

- Port interface in `application/ports/`
- Mongoose schema in `adapters/repository/`
- Repository adapter
- Service implementation
- Adapter module

---

### 7. `/analyze-architecture [module_name] [focus_area]`

Performs comprehensive architectural analysis against Clean Architecture, DDD, and best practices.

**Examples:**

```text
/analyze-architecture
/analyze-architecture order
/analyze-architecture order dependencies
/analyze-architecture "" all
```

**Focus Areas:**

- `all` - Complete architecture review (default)
- `structure` - Module structure compliance
- `dependencies` - Layer boundary violations
- `ddd` - Domain-Driven Design patterns
- `events` - Event-driven architecture

**Analyzes:**

- ✅ Clean Architecture layer separation
- ✅ Dependency rule enforcement (inward dependencies only)
- ✅ DDD patterns (Aggregates, Entities, Value Objects, Events)
- ✅ Domain events vs Event handlers separation
- ✅ Anti-pattern detection (Anemic Domain, God Objects, etc.)
- ✅ Code quality and error handling patterns
- ✅ Module structure compliance

**Output:**

- 📊 Architecture compliance score
- ✅ Strengths and well-implemented patterns
- ⚠️ Violations with severity, location, and fix recommendations
- 🎯 Prioritized improvement recommendations
- 📈 Metrics and statistics

---

### 8. `/architecture-guide [topic]`

Quick reference guide for architectural decisions and patterns.

**Examples:**

```text
/architecture-guide
/architecture-guide layers
/architecture-guide ddd
/architecture-guide events
```

**Topics:**

- `overview` - Complete architecture overview (default)
- `layers` - Layer responsibilities and boundaries
- `ddd` - Domain-Driven Design patterns (Entities, Aggregates, Value Objects)
- `events` - Domain events vs Event handlers
- `errors` - Result pattern and error handling
- `testing` - Testing strategy for each layer
- `ports` - Ports & Adapters pattern
- `naming` - Naming conventions

**Provides:**

- 📚 Pattern templates with code examples
- 🎯 Decision guides (when to use Entity vs Value Object)
- ✅ Best practices and rules
- ❌ Common mistakes to avoid
- 💡 Real examples from the Order module

---

### 9. `/analyze-code-quality [module_name] [focus_area]`

Comprehensive code quality analysis covering ESLint, Prettier, tests, TypeScript, and NestJS best practices.

**Examples:**

```text
/analyze-code-quality
/analyze-code-quality order
/analyze-code-quality "" eslint
/analyze-code-quality user tests
```

**Focus Areas:**

- `all` - Complete code quality review (default)
- `eslint` - ESLint violations and configuration
- `prettier` - Code formatting issues
- `tests` - Test coverage and quality
- `typescript` - Type safety and TS configuration
- `nestjs` - NestJS-specific best practices

**Analyzes:**

- ✅ ESLint errors, warnings, and configuration
- ✅ Prettier formatting compliance
- ✅ Test coverage (statements, branches, functions, lines)
- ✅ Missing test files and test quality
- ✅ TypeScript strict mode and type safety
- ✅ NestJS decorators and DI patterns
- ✅ Code complexity and smells
- ✅ Security vulnerabilities and outdated packages
- ✅ Git hooks and commit quality

**Output:**

- 📊 Code quality score (0-100%)
- ⚠️ Critical issues with auto-fix commands
- 🔧 Warnings and recommendations
- 📈 Detailed metrics (coverage, complexity, violations)
- 🚀 Prioritized action items
- 💡 Quick fixes and improvement suggestions

---

### 10. `/generate-tests <target> [test_type]` ⭐

Smart test generator for use cases, entities, repositories, and endpoints.

**Examples:**

```text
/generate-tests CreateOrderUseCase
/generate-tests src/modules/order/domain/Order.ts
/generate-tests order unit
/generate-tests OrderController e2e
```

**Test Types:**

- `unit` - Unit tests for use cases, entities, value objects (default)
- `integration` - Integration tests for repositories
- `e2e` - End-to-end tests for HTTP endpoints
- `all` - Generate all test types

**Generates:**

- ✅ Complete test files with proper structure
- ✅ Success and failure test cases
- ✅ Edge case coverage
- ✅ Mock setup and teardown
- ✅ Proper Arrange-Act-Assert pattern
- ✅ Result pattern testing
- ✅ Domain event verification
- ✅ Test fixtures and data

**Coverage Target:** 100% (statements, branches, functions, lines)

---

### 11. `/security-audit [scope] [module_name]` 🔒

Comprehensive security audit for OWASP Top 10, secrets detection, and vulnerabilities.

**Examples:**

```text
/security-audit
/security-audit owasp
/security-audit secrets order
/security-audit dependencies
```

**Scope:**

- `all` - Complete security analysis (default)
- `owasp` - OWASP Top 10 vulnerability scan
- `secrets` - Hardcoded secrets and credentials detection
- `dependencies` - npm audit and outdated packages
- `auth` - Authentication and authorization review
- `input-validation` - Input validation gap analysis

**Checks:**

- 🔒 OWASP A01-A10 compliance
- 🔑 Secrets/API keys in code or git history
- 💉 SQL/NoSQL injection vulnerabilities
- 🛡️ XSS and CSRF protection
- 🔐 Authentication strength (passwords, JWT)
- 🚪 Authorization gaps (missing guards)
- 📦 Vulnerable dependencies (npm audit)
- 🔍 Input validation coverage

**Output:**

- 🔒 Security score (0-100%)
- 🚨 Critical vulnerabilities with exploits
- ⚠️ High/medium/low priority issues
- 💡 Fix recommendations with code examples
- 📋 OWASP compliance checklist

---

### 12. `/refactor-to-pattern <pattern> <target>` 🔧

Refactor code to Clean Architecture and DDD patterns.

**Examples:**

```text
/refactor-to-pattern anemic-to-rich Order
/refactor-to-pattern extract-value-object Email
/refactor-to-pattern extract-usecase OrderController
/refactor-to-pattern move-to-domain ApproveOrderUseCase
```

**Patterns:**

- `anemic-to-rich` - Convert anemic domain model to rich domain model
- `extract-value-object` - Extract value objects from primitives
- `extract-usecase` - Move controller logic to use cases
- `primitive-obsession` - Find and fix primitive obsession
- `extract-aggregate` - Split god class into aggregate
- `move-to-domain` - Move business logic from use case to domain

**Refactors:**

- ✅ Anemic models → Rich domain entities
- ✅ Primitives → Value objects
- ✅ Controller logic → Use cases
- ✅ Use case logic → Domain methods
- ✅ Large entities → Aggregates with children
- ✅ Scattered validation → Guard pattern

**Provides:**

- 📝 Analysis of current code issues
- 🔧 Refactored code implementation
- 📋 Step-by-step migration guide
- ✅ Test updates needed
- 📊 Before/after comparison

---

## How to Use

1. Type `/` in Claude Code to see available skills
2. Select a skill and provide required arguments
3. Claude will generate code following Clean Architecture principles

## Architecture Alignment

All skills follow the Clean Architecture principles defined in `CLAUDE.md`:

- **Domain Layer**: Pure business logic, no framework dependencies
- **Application Layer**: Use cases, ports (interfaces), event handlers
- **Adapters Layer**: Repository implementations, external services
- **Infrastructure Layer**: NestJS wiring and DI configuration

## Dependency Rule

Skills enforce the dependency rule: Infrastructure → Adapters → Application → Domain

Domain code will never import from outer layers.
