---
name: architecture-guide
description: Quick reference guide for architectural decisions and patterns in Clean Architecture + DDD + Event-Driven systems. Use for learning or when making architectural decisions.
argument-hint: [topic]
---

# Architecture Quick Reference Guide

**Topic:** $0 (options: layers, ddd, events, errors, testing, ports, naming, overview - default: overview)

Provide a comprehensive guide for the requested topic. If no topic or "overview" is specified, provide the complete overview covering all topics.

## Overview: Clean Architecture + DDD + Event-Driven

### Key Principles
1. **Dependency Rule**: Dependencies point inward (Infrastructure → Adapters → Application → Domain)
2. **Domain Purity**: Domain layer has zero framework dependencies
3. **Port & Adapters**: Application defines interfaces, adapters implement them
4. **Event-Driven**: Domain events decouple services
5. **Result Pattern**: Functional error handling, not exceptions

### When to Use What

**Use Entity when:**
- The object has an identity that matters over time
- Two instances with same data are NOT equal (different IDs = different objects)
- The object has a lifecycle

**Use Value Object when:**
- Identity doesn't matter, only the values
- Immutable
- Two instances with same values ARE equal
- Examples: Money, Email, Address, DateRange

**Use Aggregate when:**
- You need transaction boundaries
- You need to publish domain events
- You control a cluster of entities/value objects

**Use Use Case when:**
- Orchestrating a business workflow
- Coordinating multiple aggregates
- Defining application-specific logic

**Use Domain Event when:**
- Something important happened in the domain
- Other parts of the system need to react
- You want loose coupling

### Layer Cheat Sheet

| Layer | Purpose | Can Import | Cannot Import | Examples |
|-------|---------|------------|---------------|----------|
| Domain | Business logic | @shared/ddd, @shared/commons | NestJS, DB, HTTP | Order.ts, Money.ts |
| Application | Use cases | Domain, @shared | Adapters, Infrastructure | CreateOrder.usecase.ts |
| Adapters | Implementations | Domain, Application, @shared | Infrastructure | OrderRepository.ts |
| Infrastructure | DI wiring | All layers | None (wiring only) | order.module.ts |

---

## Layer Responsibilities & Boundaries

### Domain Layer (`domain/`)
**Purpose**: Pure business logic and rules

**Contains:**
- Entities and Aggregates
- Value Objects
- Domain Events (data only, NO decorators)
- Business rules and invariants

**Rules:**
- ✅ Only import from `@shared/ddd`, `@shared/commons`
- ✅ Use TypeScript only (no framework)
- ❌ NO @Injectable, @Module, or any NestJS decorators
- ❌ NO database imports
- ❌ NO HTTP/transport layer code

**Example:**
```typescript
// ✅ GOOD - Pure domain
export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OrderProps): Result<Order> {
    const guardResult = Guard.againstNullOrUndefined(props.customerId, 'customerId');
    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.message);
    }
    const order = new Order(props);
    order.addDomainEvent(new OrderCreatedEvent(order.id));
    return Result.ok<Order>(order);
  }
}

// ❌ BAD - Framework in domain
@Injectable() // NO! Framework decorator in domain
export class Order { ... }
```

### Application Layer (`application/`)
**Purpose**: Use cases and orchestration

**Contains:**
- Use Cases (business workflows)
- Ports (interface definitions)
- Event Handlers (with @OnEvent decorator)
- DTOs

**Rules:**
- ✅ Can import domain, @shared
- ✅ Use NestJS decorators in event handlers
- ✅ Define interfaces (ports), not implementations
- ❌ NO business logic (delegate to domain)
- ❌ NO direct database/external service usage (use ports)

### Adapters Layer (`adapters/`)
**Purpose**: Implement ports with external services

**Contains:**
- Repository implementations
- External API clients
- Database schemas
- Cache adapters

### Infrastructure Layer (`infrastructure/`)
**Purpose**: Dependency injection configuration

**Contains:**
- NestJS modules
- Provider configurations
- DI wiring

---

## Domain-Driven Design Patterns

### 1. Entities
Objects with identity that persists over time.

**Template:**
```typescript
interface OrderProps {
  customerId: string;
  status: OrderStatus;
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
    const guardResult = Guard.againstNullOrUndefined(props.customerId, 'customerId');
    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.message);
    }
    return Result.ok<Order>(new Order(props, id));
  }

  get customerId(): string {
    return this.props.customerId;
  }

  // Business methods
  public cancel(): Result<void> {
    if (this.props.status === OrderStatus.Completed) {
      return Result.fail('Cannot cancel completed order');
    }
    this.props.status = OrderStatus.Cancelled;
    return Result.ok();
  }
}
```

### 2. Aggregates
Cluster of entities/value objects with a root entity that controls access.

**Template:**
```typescript
export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OrderProps): Result<Order> {
    // Validation
    const order = new Order(props);

    // Emit domain event
    order.addDomainEvent(new OrderCreatedEvent(order.id));

    return Result.ok<Order>(order);
  }

  // Aggregate enforces invariants
  public addItem(item: OrderItem): Result<void> {
    if (this.props.items.length >= 100) {
      return Result.fail('Order cannot exceed 100 items');
    }
    this.props.items.push(item);
    this.addDomainEvent(new ItemAddedEvent(this.id, item));
    return Result.ok();
  }
}
```

### 3. Value Objects
Immutable objects defined by their values, not identity.

**Template:**
```typescript
interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number, currency: string): Result<Money> {
    if (amount < 0) {
      return Result.fail('Amount cannot be negative');
    }
    if (!['USD', 'EUR', 'GBP'].includes(currency)) {
      return Result.fail('Invalid currency');
    }
    return Result.ok(new Money({ amount, currency }));
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  public add(other: Money): Result<Money> {
    if (this.currency !== other.currency) {
      return Result.fail('Cannot add different currencies');
    }
    return Money.create(this.amount + other.amount, this.currency);
  }
}
```

---

## Domain Events & Event Handlers

### Domain Event (Domain Layer - NO Decorators)

**Location:** `domain/events/OrderCreated.ts`

```typescript
import { DomainEvent, DomainEventProps } from '@shared/ddd/DomainEvent.base';

export class OrderCreated extends DomainEvent {
  public readonly orderId: string;
  public readonly customerId: string;

  constructor(props: DomainEventProps<OrderCreated>) {
    super(props);
    this.orderId = props.orderId;
    this.customerId = props.customerId;
  }
}
```

**Rules:**
- ✅ Pure data class
- ✅ Extends DomainEvent
- ❌ NO @Injectable decorator
- ❌ NO @OnEvent decorator
- ❌ NO business logic

### Event Handler (Application Layer - WITH Decorators)

**Location:** `application/events/handlers/OrderCreated.handler.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreated } from '../../../domain/events/OrderCreated';

@Injectable()
export class OrderCreatedHandler {
  constructor(
    @Inject('INotificationService') private notifications: INotificationService,
  ) {}

  @OnEvent(OrderCreated.name)
  async handle(event: OrderCreated): Promise<void> {
    // React to the event
    await this.notifications.sendOrderConfirmation(event.customerId, event.orderId);
  }
}
```

---

## Error Handling with Result Pattern

### Why Result Pattern?
- ✅ Explicit error handling
- ✅ Type-safe errors
- ✅ No hidden control flow (no thrown exceptions)
- ✅ Functional programming style

### Result<T> Usage

```typescript
// Success
return Result.ok<Order>(order);

// Failure
return Result.fail<Order>('Order not found');

// Checking results
const orderResult = await someOperation();
if (orderResult.isFailure) {
  return Result.fail(orderResult.getErrorValue());
}
const order = orderResult.getValue();
```

### Guard Pattern

```typescript
const guardResults = Guard.combine([
  Guard.againstNullOrUndefined(dto.customerId, 'customerId'),
  Guard.againstNullOrUndefined(dto.items, 'items'),
  Guard.isArray(dto.items, 'items'),
]);

if (!guardResults.succeeded) {
  return Result.fail<Order>(guardResults.message);
}
```

---

## Ports & Adapters Pattern

### Port (Application Layer - Interface)

**Location:** `application/ports/OrderRepository.port.ts`

```typescript
export interface IOrderRepository {
  save(order: Order): Promise<Result<Order>>;
  findById(id: string): Promise<Result<Order>>;
  findByCustomerId(customerId: string): Promise<Result<Order[]>>;
  delete(id: string): Promise<Result<void>>;
}
```

### Adapter (Adapters Layer - Implementation)

**Location:** `adapters/repository/Order.adapter.ts`

```typescript
@Injectable()
export class OrderRepositoryAdapter implements IOrderRepository {
  constructor(
    @InjectModel('Order') private orderModel: Model<OrderDocument>,
  ) {}

  async save(order: Order): Promise<Result<Order>> {
    try {
      // Map domain to persistence
      const orderDoc = this.toPersistence(order);
      await this.orderModel.create(orderDoc);
      return Result.ok(order);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  private toPersistence(order: Order): any {
    return {
      _id: order.id.toString(),
      customerId: order.customerId,
      status: order.status,
    };
  }

  private toDomain(doc: OrderDocument): Result<Order> {
    return Order.create({
      customerId: doc.customerId,
      status: doc.status,
    }, new UniqueEntityID(doc._id));
  }
}
```

---

## Naming Conventions

### Files
- **Entities:** `Order.ts`, `Customer.ts` (PascalCase, singular)
- **Value Objects:** `Money.ts`, `Email.ts` (PascalCase)
- **Use Cases:** `CreateOrder.usecase.ts`, `UpdateUser.usecase.ts`
- **DTOs:** `CreateOrder.dto.ts`
- **Events:** `OrderCreated.ts`, `UserRegistered.ts`
- **Handlers:** `OrderCreated.handler.ts`
- **Modules:** `order.module.ts` (lowercase)
- **Tests:** `Order.spec.ts`, `CreateOrder.spec.ts`

### Classes & Interfaces
- **Entities:** `Order`, `User` (PascalCase, no suffix)
- **Aggregates:** `Order` (same as entity, extends AggregateRoot)
- **Value Objects:** `Money`, `Email` (PascalCase, descriptive)
- **Use Cases:** `CreateOrderUseCase`, `UpdateUserUseCase`
- **Ports:** `IOrderRepository`, `IEmailService` (I prefix)
- **Events:** `OrderCreated`, `UserRegistered` (PascalCase, past tense)
- **DTOs:** `CreateOrderDTO`, `UpdateUserDTO`

### Methods
- **Domain:** Business language (`cancel()`, `approve()`, `calculateTotal()`)
- **CRUD:** `create()`, `update()`, `delete()` (static factories)
- **Queries:** `findById()`, `findByCustomerId()`
- **Use Cases:** `execute()`

---

Provide clear, actionable guidance with code examples following the exact patterns used in this codebase. Reference specific files from the Order module when helpful.
