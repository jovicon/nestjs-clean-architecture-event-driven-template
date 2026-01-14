# TODO: Clean Architecture Best Practices Implementation

This file tracks the implementation of the three critical approaches for maximizing the effectiveness of this Clean Architecture template.

## Overview

- **Status Legend:** ❌ Not Started | 🟡 In Progress | ✅ Completed
- **Priority:** 🔴 High | 🟠 Medium | 🟢 Low

---

## 1. Strict Layer Separation with Port-Adapter Pattern

**Goal:** Ensure domain and application layers only depend on interfaces (ports), never concrete implementations.

### 1.1 Audit Current Architecture

- [x] ✅ 🔴 Review `src/modules/order/` for layer boundary violations
  - [x] Check: `src/modules/order/domain/` - Should have ZERO imports from `application/adapters` ✅
  - [x] Check: `src/modules/order/application/useCases/` - Should only use port interfaces ✅
  - [x] Check: `src/modules/order/adapters/` - Should implement ports from application layer ✅
  - [x] Created `infrastructure/` layer for NestJS wiring ✅
  - [x] Moved event handlers from domain to application layer ✅

- [x] ✅ 🟠 Husky replaced with Lefthook

- [x] ✅ 🔴 Review `src/modules/products/` for layer boundary violations
  - ⚠️ **DOCUMENTED VIOLATIONS** - See `PRODUCTS_MODULE_AUDIT.md` for details
  - Found 11 critical violations across all layers
  - Module is a copy of Order module, not a real Products module
  - Decision: Left as-is for example purposes, documented in audit file
  - Note: DO NOT use this module as reference for clean architecture

- [x] ✅ 🟠 Review `src/shared/` for proper abstraction separation
  - ⚠️ **CRITICAL VIOLATIONS FOUND** - See review findings below
  - Found 3 high-severity layer boundary violations:
    1. `ddd/AggregateRoot.ts` - Imports `@nestjs/event-emitter` (framework in domain)
    2. `commons/core/Event.handler.ts` - Imports `@nestjs/event-emitter` (framework in commons)
    3. `commons/core/Event.handler.ts` - Upward dependency to Application layer
  - Impact: Domain layer indirectly coupled to NestJS through EventHandler
  - Positive: Guard, Result, UseCase, ValueObject are pure (zero framework deps)
  - Recommendation: Refactor event publishing to use DI instead of direct imports

- [ ] ❌ 🔴 Fix `src/shared/` layer boundary violations
  - [ ] Refactor `AggregateRoot.ts` to remove `@nestjs/event-emitter` import
    - Change `publishEvents()` to accept generic interface/callback
    - Move EventEmitter2 integration to Infrastructure layer
  - [ ] Refactor `Event.handler.ts` to remove framework dependencies
    - Remove `@nestjs/event-emitter` import
    - Remove upward dependency to `RequestContextService`
    - Pass requestId as parameter instead of static initialization
  - [ ] Separate event management from context awareness
    - Extract event storage logic (add/clear) to pure base class
    - Move publishing logic to Infrastructure layer
  - [x] Rename `adapters/repository/interface.ts` to `Repository.port.ts` for consistency ✅
  - [x] Add comprehensive documentation comments to port interfaces ✅

### 1.2 Define Missing Ports (Interfaces)

- [ ] ❌ 🔴 Create port interfaces for repositories
  - Location: `src/modules/order/application/ports/IOrderRepository.ts`
  - Location: `src/modules/products/application/ports/IProductRepository.ts`
  - Template:

    ```typescript
    export interface IOrderRepository {
      save(order: Order): Promise<Order>;
      findById(id: string): Promise<Order | null>;
      delete(id: string): Promise<void>;
      findByCustomerId(customerId: string): Promise<Order[]>;
    }
    ```

- [ ] ❌ 🟠 Create port interfaces for external services
  - Location: `src/modules/order/application/ports/IPaymentService.ts`
  - Location: `src/modules/order/application/ports/INotificationService.ts`

- [ ] ❌ 🟠 Create port interfaces for cache service
  - Location: `src/shared/application/ports/ICacheService.ts`

- [ ] ❌ 🟠 Create port interfaces for HTTP client
  - Location: `src/shared/application/ports/IHttpClient.ts`

### 1.3 Refactor Use Cases to Depend on Ports

- [ ] ❌ 🔴 Update all use cases in `src/modules/order/application/useCases/`
  - Replace concrete repository dependencies with port interfaces
  - Ensure constructor injection uses interfaces only
  - Example files to update:
    - `src/modules/order/application/useCases/*/[UseCase].usecase.ts`

- [ ] ❌ 🔴 Update all use cases in `src/modules/products/application/useCases/`
  - Replace concrete dependencies with port interfaces

### 1.4 Update Module Providers

- [ ] ❌ 🔴 Update NestJS module providers to inject implementations via DI
  - Location: `src/modules/order/application/useCases/*/[UseCase].module.ts`
  - Pattern:

    ```typescript
    providers: [
      {
        provide: 'IOrderRepository',
        useClass: MongoOrderRepository,
      },
      CreateOrderUseCase,
    ]
    ```

- [ ] ❌ 🟠 Create shared provider configurations
  - Location: `src/shared/adapters/providers.config.ts`

### 1.5 Validate Domain Layer Purity

- [ ] ❌ 🔴 Ensure domain entities have NO framework dependencies
  - Check: `src/modules/order/domain/*.ts` - No NestJS decorators
  - Check: `src/modules/products/domain/*.ts` - No Mongoose decorators
  - Domain should only extend base classes from `src/shared/ddd/`

---

## 2. Event-Driven Domain Design with Choreography

**Goal:** Implement robust domain events and choreography-based sagas for loose coupling.

### 2.1 Audit Current Event Implementation

- [ ] ❌ 🔴 Review existing domain events
  - Location: `src/modules/order/domain/events/emitters/`
  - Verify: Events extend `DomainEvent` base class
  - Verify: Events are past tense (OrderCreated, not CreateOrder)

- [ ] ❌ 🟠 Review existing event handlers
  - Location: `src/modules/order/domain/events/handlers/`
  - Verify: Handlers use `@EventsHandler()` decorator
  - Verify: Handlers implement `IEventHandler<T>`

### 2.2 Identify Missing Domain Events

- [ ] ❌ 🔴 Map all domain actions that should emit events
  - Order module:
    - [ ] OrderCreated
    - [ ] OrderUpdated
    - [ ] OrderCancelled
    - [ ] OrderShipped
    - [ ] OrderDelivered
  - Product module:
    - [ ] ProductCreated
    - [ ] ProductUpdated
    - [ ] ProductDeleted
    - [ ] InventoryUpdated

- [ ] ❌ 🟠 Document event flow diagrams
  - Location: `_docs/events/event-flows.md`

### 2.3 Implement Missing Domain Events

- [ ] ❌ 🔴 Create event emitters
  - Template location: `src/modules/order/domain/events/emitters/OrderCreated.event.ts`
  - Template:

    ```typescript
    import { DomainEvent } from '@shared/ddd/DomainEvent.base';

    export class OrderCreatedEvent extends DomainEvent {
      constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly totalAmount: number,
      ) {
        super({ aggregateId: orderId });
      }
    }
    ```

- [ ] ❌ 🔴 Add events to aggregates
  - Update: `src/modules/order/domain/Order.ts`
  - Pattern:

    ```typescript
    public static create(props: OrderProps): Result<Order> {
      const order = new Order(props);
      order.addDomainEvent(new OrderCreatedEvent(order.id, order.customerId));
      return Result.ok(order);
    }
    ```

### 2.4 Implement Event Handlers

- [ ] ❌ 🔴 Create cross-module event handlers for choreography
  - Location: `src/modules/[module]/domain/events/handlers/`
  - Examples:
    - `OrderCreatedHandler.ts` → Update inventory
    - `OrderCreatedHandler.ts` → Send notification
    - `PaymentProcessedHandler.ts` → Confirm order

- [ ] ❌ 🟠 Ensure handlers are idempotent
  - Add event ID tracking to prevent duplicate processing
  - Location: Consider adding `src/shared/adapters/eventstore/`

### 2.5 Update Use Cases to Publish Events

- [ ] ❌ 🔴 Ensure all use cases publish aggregate events after persistence
  - Pattern:

    ```typescript
    // After successful save
    const savedOrder = await this.orderRepository.save(order);

    // Publish domain events
    savedOrder.domainEvents.forEach(event => {
      this.eventEmitter.emit(event.constructor.name, event);
    });
    savedOrder.clearEvents();
    ```

- [ ] ❌ 🟠 Add error handling for event publishing failures
  - Consider implementing outbox pattern
  - Location: `src/shared/adapters/eventstore/outbox/`

### 2.6 Implement Choreography Sagas

- [ ] ❌ 🟠 Review saga documentation
  - Read: `_docs/microservice_labs/`

- [ ] ❌ 🟠 Implement example saga: Order Processing Flow
  - Flow: OrderCreated → ValidateInventory → ProcessPayment → ConfirmOrder
  - Create handlers for each step in respective modules

- [ ] ❌ 🟢 Document saga patterns
  - Location: `_docs/sagas/order-processing-saga.md`

---

## 3. Result/Either Pattern for Explicit Error Handling

**Goal:** Eliminate throw exceptions in domain/application layers; use Result pattern for all operations.

### 3.1 Audit Current Error Handling

- [ ] ❌ 🔴 Search for `throw` statements in domain layer
  - Search: `src/modules/*/domain/` for `throw new Error`
  - Should be: Return `Result.fail()` instead

- [ ] ❌ 🔴 Search for `throw` statements in application layer
  - Search: `src/modules/*/application/useCases/` for `throw`
  - Should be: Return `Result.fail()` instead

- [ ] ❌ 🟠 Review use cases return types
  - All should return: `Promise<Result<T>>` or `Result<T>`

### 3.2 Implement Guard Validations

- [ ] ❌ 🔴 Add Guards to all entity factory methods
  - Location: `src/modules/order/domain/Order.ts` → `Order.create()`
  - Pattern:

    ```typescript
    public static create(props: OrderProps): Result<Order> {
      const guardResult = Guard.againstNullOrUndefinedBulk([
        { argument: props.customerId, argumentName: 'customerId' },
        { argument: props.items, argumentName: 'items' },
      ]);

      if (!guardResult.succeeded) {
        return Result.fail<Order>(guardResult.message);
      }

      // Additional business validation
      if (props.items.length === 0) {
        return Result.fail<Order>('Order must have at least one item');
      }

      const order = new Order(props);
      return Result.ok<Order>(order);
    }
    ```

- [ ] ❌ 🔴 Add Guards to all value object factory methods
  - Review all files in: `src/modules/*/domain/*ValueObject.ts`

### 3.3 Refactor Use Cases to Return Results

- [ ] ❌ 🔴 Update all use cases in Order module
  - Files: `src/modules/order/application/useCases/*/[UseCase].usecase.ts`
  - Return type: `Promise<Result<ResponseDTO>>`
  - Remove all `try-catch` blocks; use Result pattern

- [ ] ❌ 🔴 Update all use cases in Products module
  - Files: `src/modules/products/application/useCases/*/[UseCase].usecase.ts`

- [ ] ❌ 🟠 Chain Results for complex flows
  - Example: Validation → Entity Creation → Persistence
  - Use `Result.combine()` for multiple validations

### 3.4 Update Controllers to Handle Results

- [ ] ❌ 🔴 Update HTTP controllers
  - Location: `src/modules/order/application/ms/http/`
  - Pattern:

    ```typescript
    @Post()
    async createOrder(@Body() dto: CreateOrderDto) {
      const result = await this.createOrderUseCase.execute(dto);

      if (result.isFailure) {
        throw new BadRequestException(result.getErrorValue());
      }

      return result.getValue();
    }
    ```

- [ ] ❌ 🟠 Update WebSocket gateways
  - Location: `src/modules/order/application/ms/websocket/`

- [ ] ❌ 🟠 Update TCP controllers
  - Location: `src/modules/order/application/ms/tcp/`

### 3.5 Create Domain Error Classes

- [ ] ❌ 🟠 Create base domain error
  - Location: `src/shared/ddd/DomainError.ts`
  - Template:

    ```typescript
    export abstract class DomainError extends Error {
      constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
      }
    }
    ```

- [ ] ❌ 🟠 Create specific domain errors
  - Location: `src/modules/order/domain/errors/`
  - Examples:
    - `OrderNotFoundError.ts`
    - `InvalidOrderStateError.ts`
    - `InsufficientInventoryError.ts`

### 3.6 Add Comprehensive Validation

- [ ] ❌ 🟠 Review and enhance Guard utility
  - Location: `src/shared/commons/Guard.ts`
  - Add missing validations:
    - Email format
    - Phone format
    - Date ranges
    - Numeric ranges

- [ ] ❌ 🟠 Create custom validators for domain rules
  - Location: `src/modules/order/domain/validators/`

---

## 4. Additional Improvements (Bonus)

### 4.1 Testing

- [x] ✅ 🟠 Create unit tests for config module
  - Created comprehensive tests for all config providers
  - Achieved 100% coverage (45/45 statements, 17/17 functions, 43/43 lines)
  - 46 tests across 5 test suites

- [ ] ❌ 🟠 Create unit tests for all use cases
  - Pattern: `[UseCase].usecase.spec.ts`
  - Test both success and failure paths with Result pattern

- [ ] ❌ 🟠 Create unit tests for domain entities
  - Pattern: `[Entity].spec.ts`
  - Test factory methods and business logic

- [ ] ❌ 🟢 Create integration tests for event flows
  - Test complete saga workflows

### 4.2 Documentation

- [ ] ❌ 🟠 Document port interfaces
  - Add JSDoc comments explaining each port's responsibility

- [ ] ❌ 🟠 Document domain events
  - Create event catalog: `_docs/events/event-catalog.md`

- [ ] ❌ 🟢 Create architecture decision records (ADRs)
  - Location: `_docs/adr/`

### 4.3 Code Quality

- [ ] ❌ 🟢 Run ESLint and fix violations
  - Command: `npm run lint`

- [ ] ❌ 🟢 Run tests and ensure coverage
  - Command: `npm run test:cov`
  - Target: >80% coverage

- [ ] ❌ 🟢 Run SonarQube analysis
  - Fix critical/major issues

---

## 5. Module Migration to New Structure

**Goal:** Migrate all modules to follow the new 4-layer architecture (Domain → Application → Adapters → Infrastructure).

### 5.1 Migrate Products Module

- [ ] ❌ 🔴 Create `src/modules/products/infrastructure/` layer
  - [ ] Create `products.module.ts` with DI wiring
  - [ ] Move adapter imports from application to infrastructure

- [ ] ❌ 🔴 Review and fix layer boundary violations
  - [ ] Ensure domain has zero framework dependencies
  - [ ] Move event handlers to `application/events/handlers/`
  - [ ] Update ports to not import from adapters

- [ ] ❌ 🟠 Update module imports
  - [ ] Update HTTP module to use infrastructure module
  - [ ] Update tests with new module structure

### 5.2 Migrate Logger Module

- [ ] ❌ 🔴 Create `src/modules/logger/infrastructure/` layer
  - [ ] Create `logger.module.ts` with DI wiring
  - [ ] Move adapter imports from application to infrastructure

- [ ] ❌ 🟠 Review and fix layer boundary violations
  - [ ] Ensure domain has zero framework dependencies
  - [ ] Update ports to not import from adapters

### 5.3 Validate All Modules

- [ ] ❌ 🟠 Run architecture validation
  - [ ] Verify all domain layers have zero `@nestjs/*` imports
  - [ ] Verify all application layers don't import from adapters
  - [ ] Verify all ports use DTOs instead of schemas

- [ ] ❌ 🟢 Update documentation
  - [ ] Update module-specific READMEs if they exist
  - [ ] Add migration notes to `_docs/`

---

## Progress Tracker

| Approach | Total Tasks | Completed | In Progress | Not Started | % Complete |
| -------- | ----------- | --------- | ----------- | ----------- | ---------- |
| 1. Port-Adapter Pattern | 12 | 4 | 0 | 8 | 33% |
| 2. Event-Driven Design | 13 | 0 | 0 | 13 | 0% |
| 3. Result Pattern | 14 | 0 | 0 | 14 | 0% |
| 4. Bonus Improvements | 8 | 1 | 0 | 7 | 13% |
| 5. Module Migration | 8 | 0 | 0 | 8 | 0% |
| **TOTAL** | **55** | **5** | **0** | **50** | **9%** |

---

## Completed Tasks Log

### 2026-01-14

- ✅ **Config Module Unit Tests - 100% Coverage**
  - Created comprehensive unit tests for all config providers
  - Test files created:
    - `src/config/config.service.spec.ts` - 9 tests covering config orchestration
    - `src/config/config.module.spec.ts` - 5 tests covering NestJS module setup
    - `src/config/providers/database.config.spec.ts` - 6 tests covering database configuration
    - `src/config/providers/logger.module.config.spec.ts` - 25 tests covering all logger configuration getters
    - `src/config/providers/microservice.config.spec.ts` - 7 tests covering version parsing from package.json
  - Coverage achieved:
    - Statements: 100% (45/45)
    - Branches: 100% (0/0)
    - Functions: 100% (17/17)
    - Lines: 100% (43/43)
  - Total: 46 tests passed across 5 test suites
  - Test patterns: Proper mocking with jest, error handling scenarios, edge cases
  - All tests follow existing project conventions

### 2026-01-12

- ✅ **Shared Layer Abstraction Separation Review**
  - Reviewed entire `src/shared/` directory for Clean Architecture compliance
  - Found 3 critical layer boundary violations:
    - `ddd/AggregateRoot.ts` imports `@nestjs/event-emitter` (framework dependency in domain)
    - `commons/core/Event.handler.ts` imports `@nestjs/event-emitter` (framework in commons)
    - `commons/core/Event.handler.ts` has upward dependency to `application/context/RequestContextService`
  - Identified root cause: EventHandler base class pollutes domain layer with framework coupling
  - Documented structural issues:
    - EventHandler mixing concerns (event management + context + framework)
    - Static RequestContext dependency problematic for domain objects outside HTTP context
    - Inconsistent port naming (`interface.ts` vs `logger.port.ts`)
  - Positive findings:
    - Guard, Result, UseCase, ValueObject, Identifier are pure (zero framework deps)
    - Repository interfaces properly separated from implementations
    - Adapters correctly isolated
  - Created task list for fixing violations with refactoring strategy
  - Impact: Every domain Entity is indirectly coupled to NestJS through EventHandler inheritance

- ✅ **Port Interface Naming Standardization & Documentation**
  - Renamed `src/shared/adapters/repository/interface.ts` to `Repository.port.ts`
  - Added comprehensive JSDoc documentation to `Repository.port.ts`:
    - Interface overview with architecture context
    - Generic type parameter documentation
    - Detailed method documentation with @param, @returns, @throws, @remarks
    - Code examples for each method
    - Best practices and usage patterns
    - @todo annotations for future improvements (pagination, better type safety)
  - Enhanced `src/shared/adapters/ports/logger.port.ts` with comprehensive documentation:
    - Port interface overview and purpose
    - Dependency injection examples
    - Detailed method documentation for log(), error(), warn(), debug()
    - Use case examples for each log level
    - Best practices for production vs development logging
  - Updated all 3 import references to use new `Repository.port.ts`:
    - `src/shared/adapters/repository/mongoose/mongoose.service.ts`
    - `src/modules/order/adapters/repository/order.interface.ts`
    - `src/modules/products/adapters/repository/order.interface.ts`
  - Deleted old `interface.ts` file
  - Verified build passes with new structure
  - Consistent naming convention now established: `[InterfaceName].port.ts`

### 2026-01-10

- ✅ **Husky replaced with Lefthook**
  - Uninstalled Husky package from devDependencies
  - Installed Lefthook v2.0.13
  - Created `lefthook.yml` with pre-commit hook running `npm test`
  - Updated `package.json` prepare script from `husky install` to `lefthook install`
  - Removed `.husky/` directory
  - Fixed git `core.hooksPath` config (was pointing to old `.husky/_`)
  - Verified hooks work correctly in git worktree environment

- ✅ **Products Module Layer Boundary Audit**
  - Reviewed all layers: Domain, Application, Adapters, Infrastructure
  - Found 11 critical violations of clean architecture boundaries
  - Created comprehensive audit report: `PRODUCTS_MODULE_AUDIT.md`
  - Violations documented:
    - Domain layer: 2 violations (cross-module domain imports)
    - Application layer: 4 violations (importing from other module's domain/application)
    - Adapters layer: 2 violations (importing domain from other modules)
    - Infrastructure layer: 3 violations (importing all adapters from order module)
  - Root cause: Module is copy-paste of Order module, not a real Products module
  - Decision: Left as-is, documented for educational purposes
  - Added warning notes to prevent use as clean architecture reference

### 2026-01-07

- ✅ **Order Module Layer Boundary Audit**
  - Fixed domain layer: removed all `@nestjs/*` imports from event handlers
  - Moved `orderCreated.handler.ts` from `domain/events/handlers/` to `application/events/`
  - Fixed port `orderService.port.ts`: replaced schema import with DTO
  - Created `infrastructure/order.module.ts` for NestJS DI wiring
  - Updated `CreateOrder.module.ts` to not import from adapters
  - Updated `api.module.ts` to use `OrderInfrastructureModule`
  - Fixed all unit tests (12 passing)

---

## Next Steps

1. ~~**Start Here:** Begin with approach #1 (Port-Adapter Pattern) as it establishes the foundation~~ ✅ Done for Order module
2. **Current Focus:** Migrate `products` and `logger` modules to new structure
3. **Priority Order:**
   - Complete all 🔴 High priority tasks first
   - Then tackle 🟠 Medium priority tasks
   - Finally address 🟢 Low priority tasks
4. **Replicate Pattern:** Apply same patterns from `order` module to other modules

---

## Notes

- Update this file as you complete tasks
- Add new tasks as you discover architectural improvements
- Link to specific commits when tasks are completed
- Document any deviations from the plan with rationale

---

**Last Updated:** 2026-01-14
**Current Focus:** Config module achieved 100% test coverage. Next: Fix `src/shared/` layer boundary violations before migrating remaining modules
