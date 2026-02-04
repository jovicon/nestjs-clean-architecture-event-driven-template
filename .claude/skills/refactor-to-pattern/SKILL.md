---
name: refactor-to-pattern
description: Refactor code to Clean Architecture and DDD patterns. Use when improving code to follow Clean Architecture principles, fixing anti-patterns, or applying DDD patterns.
argument-hint: [pattern] [target]
disable-model-invocation: true
---

# Refactor to Pattern: $0

**Target:** $1

**Pattern options:** anemic-to-rich, extract-value-object, extract-usecase, primitive-obsession, extract-aggregate, move-to-domain

---

## Pattern: Anemic Domain Model → Rich Domain Model

**Problem:** Entity has only getters/setters with no behavior. Business logic lives in services/use cases instead of domain.

### Step 1: Analyze Current Code

Read the target entity and identify:
- ❌ Public setters allowing uncontrolled state mutations
- ❌ No business methods (only getters/setters)
- ❌ Validation in use cases instead of entity
- ❌ Business logic scattered in services

**Example of Anemic Model:**
```typescript
// ❌ ANEMIC - Just a data container
export class Order {
  private _id: string;
  private _status: OrderStatus;
  private _total: number;
  private _items: OrderItem[];

  // Just getters and setters
  get status(): OrderStatus {
    return this._status;
  }

  set status(value: OrderStatus) {
    this._status = value; // No validation!
  }

  get total(): number {
    return this._total;
  }

  set total(value: number) {
    this._total = value; // No business rules!
  }
}

// Business logic in service
class OrderService {
  async cancelOrder(orderId: string) {
    const order = await this.repository.findById(orderId);

    // ❌ Business logic here instead of in Order
    if (order.status === OrderStatus.Shipped) {
      throw new Error('Cannot cancel shipped order');
    }

    order.status = OrderStatus.Cancelled; // Direct mutation
    await this.repository.save(order);
  }
}
```

### Step 2: Refactor to Rich Domain Model

**Transform to:**

```typescript
// ✅ RICH DOMAIN MODEL - Encapsulates behavior
export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  // Factory method with validation
  public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.customerId, argumentName: 'customerId' },
      { argument: props.items, argumentName: 'items' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.message);
    }

    // Business rule: Order must have at least one item
    if (props.items.length === 0) {
      return Result.fail<Order>('Order must contain at least one item');
    }

    const order = new Order(props, id);
    order.addDomainEvent(new OrderCreatedEvent(order.id));
    return Result.ok<Order>(order);
  }

  // Business method with rules
  public cancel(): Result<void> {
    // Business rule encapsulated in domain
    if (this.props.status === OrderStatus.Shipped) {
      return Result.fail('Cannot cancel order that has been shipped');
    }

    if (this.props.status === OrderStatus.Delivered) {
      return Result.fail('Cannot cancel delivered order');
    }

    this.props.status = OrderStatus.Cancelled;
    this.addDomainEvent(new OrderCancelledEvent(this.id));

    return Result.ok();
  }

  // Business method for adding items
  public addItem(item: OrderItem): Result<void> {
    // Business rule: Maximum 100 items per order
    if (this.props.items.length >= 100) {
      return Result.fail('Order cannot exceed 100 items');
    }

    this.props.items.push(item);
    this.recalculateTotal();

    return Result.ok();
  }

  // Business logic for total calculation
  private recalculateTotal(): void {
    this.props.total = this.props.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // Read-only access (no setters)
  get status(): OrderStatus {
    return this.props.status;
  }

  get total(): number {
    return this.props.total;
  }

  get items(): ReadonlyArray<OrderItem> {
    return this.props.items;
  }
}

// Use case becomes thin orchestration
class CancelOrderUseCase {
  async execute(orderId: string): Promise<Result<void>> {
    const orderResult = await this.repository.findById(orderId);

    if (orderResult.isFailure) {
      return Result.fail('Order not found');
    }

    const order = orderResult.getValue();

    // Delegate to domain
    const cancelResult = order.cancel();

    if (cancelResult.isFailure) {
      return cancelResult;
    }

    await this.repository.save(order);
    return Result.ok();
  }
}
```

### Step 3: Refactoring Checklist

- [ ] Replace public setters with business methods
- [ ] Move validation from use cases to entity factory
- [ ] Move business logic from services to domain methods
- [ ] Add Guard validations to factory method
- [ ] Return Result<T> from all business methods
- [ ] Add domain events for state changes
- [ ] Make getters return readonly/immutable data
- [ ] Update use cases to call domain methods
- [ ] Add unit tests for new business methods

---

## Pattern: Primitive Obsession → Value Object

**Problem:** Using primitives (string, number) instead of meaningful domain concepts.

### Step 1: Identify Primitive Obsession

Look for:
- ❌ Strings representing emails, phone numbers, money
- ❌ Numbers with business meaning (age, price, quantity)
- ❌ Multiple related primitives (amount + currency, street + city + zip)
- ❌ Validation scattered across codebase

**Example:**
```typescript
// ❌ PRIMITIVE OBSESSION
interface UserProps {
  email: string; // Just a string!
  age: number; // Just a number!
  balance: number; // What currency?
  phone: string; // Any format accepted
}

// Validation scattered everywhere
if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  throw new Error('Invalid email');
}
```

### Step 2: Extract Value Object

**Create the Value Object:**

```typescript
// ✅ VALUE OBJECT - Email
interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email> {
    if (!email) {
      return Result.fail('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Result.fail('Invalid email format');
    }

    return Result.ok(new Email({ value: email.toLowerCase() }));
  }

  get value(): string {
    return this.props.value;
  }

  // Domain behavior
  public getDomain(): string {
    return this.props.value.split('@')[1];
  }
}

// ✅ VALUE OBJECT - Money
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

    const validCurrencies = ['USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(currency)) {
      return Result.fail(`Invalid currency: ${currency}`);
    }

    return Result.ok(new Money({ amount, currency }));
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  // Domain behavior
  public add(other: Money): Result<Money> {
    if (this.currency !== other.currency) {
      return Result.fail('Cannot add different currencies');
    }

    return Money.create(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Result<Money> {
    return Money.create(this.amount * factor, this.currency);
  }
}
```

### Step 3: Update Entity to Use Value Object

```typescript
// ✅ REFACTORED - Using Value Objects
interface UserProps {
  email: Email; // Now a proper domain concept!
  age: Age; // Business rules enforced
  balance: Money; // Amount + currency together
  phone: PhoneNumber; // Format validated
}

export class User extends Entity<UserProps> {
  public static create(props: {
    email: string;
    age: number;
    balance: { amount: number; currency: string };
    phone: string;
  }): Result<User> {
    // Create value objects
    const emailOrError = Email.create(props.email);
    const ageOrError = Age.create(props.age);
    const balanceOrError = Money.create(props.balance.amount, props.balance.currency);
    const phoneOrError = PhoneNumber.create(props.phone);

    // Combine results
    const result = Result.combine([emailOrError, ageOrError, balanceOrError, phoneOrError]);

    if (result.isFailure) {
      return Result.fail(result.getErrorValue());
    }

    return Result.ok(new User({
      email: emailOrError.getValue(),
      age: ageOrError.getValue(),
      balance: balanceOrError.getValue(),
      phone: phoneOrError.getValue(),
    }));
  }

  get email(): Email {
    return this.props.email;
  }

  get balance(): Money {
    return this.props.balance;
  }

  // Business method using value object behavior
  public addBalance(amount: Money): Result<void> {
    const newBalanceResult = this.balance.add(amount);

    if (newBalanceResult.isFailure) {
      return Result.fail(newBalanceResult.getErrorValue());
    }

    this.props.balance = newBalanceResult.getValue();
    return Result.ok();
  }
}
```

### Step 4: Common Value Objects to Extract

- **Email** - email validation
- **Money** - amount + currency
- **PhoneNumber** - format validation
- **Address** - street, city, state, zip
- **Age** - range validation (0-150)
- **Percentage** - 0-100 validation
- **DateRange** - start + end dates
- **URL** - URL validation
- **Quantity** - positive integer
- **Name** - first + last name

---

## Pattern: Controller Logic → Use Case

**Problem:** Business logic in controllers instead of use cases.

### Step 1: Identify Controller with Business Logic

```typescript
// ❌ BAD - Business logic in controller
@Controller('orders')
export class OrderController {
  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    // ❌ Validation logic in controller
    if (!dto.customerId) {
      throw new BadRequestException('Customer ID required');
    }

    if (dto.items.length === 0) {
      throw new BadRequestException('Order must have items');
    }

    // ❌ Business logic in controller
    const total = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ❌ Direct repository usage
    const order = await this.orderRepository.create({
      customerId: dto.customerId,
      items: dto.items,
      total,
      status: 'pending',
    });

    // ❌ Side effects in controller
    await this.emailService.sendOrderConfirmation(order.id);

    return order;
  }
}
```

### Step 2: Extract to Use Case

```typescript
// ✅ GOOD - Use case handles orchestration
@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderDTO, Result<OrderDTO>> {
  constructor(
    @Inject('IOrderRepository') private orderRepo: IOrderRepository,
    @Inject('IEmailService') private emailService: IEmailService,
  ) {}

  async execute(dto: CreateOrderDTO): Promise<Result<OrderDTO>> {
    // Create domain entity (validation included)
    const orderOrError = Order.create({
      customerId: dto.customerId,
      items: dto.items.map(item => OrderItem.create(item).getValue()),
    });

    if (orderOrError.isFailure) {
      return Result.fail(orderOrError.getErrorValue());
    }

    const order = orderOrError.getValue();

    // Persist
    const saveResult = await this.orderRepo.save(order);

    if (saveResult.isFailure) {
      return Result.fail('Failed to create order');
    }

    // Side effects (could be event-driven instead)
    await this.emailService.sendOrderConfirmation(order.id.toString());

    // Return DTO
    return Result.ok(OrderMapper.toDTO(order));
  }
}

// ✅ GOOD - Thin controller
@Controller('orders')
export class OrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    const result = await this.createOrderUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.getErrorValue());
    }

    return result.getValue();
  }
}
```

---

## Pattern: Business Logic from Use Case → Domain

**Problem:** Business logic in use cases instead of domain entities.

### Step 1: Identify Misplaced Business Logic

```typescript
// ❌ BAD - Business logic in use case
class ApproveOrderUseCase {
  async execute(orderId: string): Promise<Result<void>> {
    const order = await this.orderRepo.findById(orderId);

    // ❌ Business rule in use case
    if (order.total > 10000 && !order.hasManagerApproval) {
      return Result.fail('Orders over $10k require manager approval');
    }

    // ❌ Business rule in use case
    if (order.items.some(item => item.quantity > 100)) {
      return Result.fail('Bulk orders require special handling');
    }

    // Direct state mutation
    order.status = 'approved';

    await this.orderRepo.save(order);
    return Result.ok();
  }
}
```

### Step 2: Move to Domain

```typescript
// ✅ GOOD - Business logic in domain
export class Order extends AggregateRoot<OrderProps> {
  public approve(approver: User): Result<void> {
    // Business rule in domain
    if (this.requiresManagerApproval() && !approver.isManager()) {
      return Result.fail('This order requires manager approval');
    }

    // Business rule in domain
    if (this.isBulkOrder()) {
      return Result.fail('Bulk orders require special approval process');
    }

    // State change through business method
    this.props.status = OrderStatus.Approved;
    this.props.approvedBy = approver.id;
    this.props.approvedAt = new Date();

    // Domain event
    this.addDomainEvent(new OrderApprovedEvent(this.id, approver.id));

    return Result.ok();
  }

  private requiresManagerApproval(): boolean {
    return this.props.total.amount > 10000;
  }

  private isBulkOrder(): boolean {
    return this.props.items.some(item => item.quantity > 100);
  }
}

// ✅ GOOD - Thin use case
class ApproveOrderUseCase {
  async execute(orderId: string, userId: string): Promise<Result<void>> {
    const orderResult = await this.orderRepo.findById(orderId);
    const userResult = await this.userRepo.findById(userId);

    if (orderResult.isFailure || userResult.isFailure) {
      return Result.fail('Order or user not found');
    }

    const order = orderResult.getValue();
    const user = userResult.getValue();

    // Delegate to domain
    const approveResult = order.approve(user);

    if (approveResult.isFailure) {
      return approveResult;
    }

    await this.orderRepo.save(order);
    return Result.ok();
  }
}
```

### Signs of Misplaced Logic:

- ❌ `if` statements with business rules in use cases
- ❌ Calculations in use cases
- ❌ Direct property assignments (`order.status = ...`)
- ❌ Comments explaining business rules in use cases

### Where Logic Should Live:

- ✅ **Domain entities** - Business rules, validations, calculations
- ✅ **Use cases** - Orchestration, fetching data, calling domain methods
- ✅ **Controllers** - HTTP concerns, DTO mapping, error handling

---

## Refactoring Guidelines

### General Principles:

1. **Read First** - Understand current code structure
2. **Identify Pattern** - Recognize anti-pattern or smell
3. **Plan Refactoring** - Design new structure
4. **Write Tests** - Before refactoring (if not already tested)
5. **Refactor** - Small incremental changes
6. **Run Tests** - Verify behavior unchanged
7. **Clean Up** - Remove old code, update imports

### Clean Architecture Rules:

- Business logic → Domain layer
- Orchestration → Use cases
- Framework concerns → Infrastructure
- Validation → Domain (factory methods)
- DTOs → Application layer

### Result Pattern:

- All domain methods return `Result<T>`
- All use cases return `Result<T>` or `Either<L, R>`
- Controllers handle Result failures → HTTP exceptions

---

## Output

Provide:
1. **Analysis** - What's wrong with current code
2. **Refactored Code** - Complete implementation of new pattern
3. **Migration Steps** - How to safely apply refactoring
4. **Test Updates** - Changes needed in tests
5. **Before/After Comparison** - Clear visual of improvement

Make incremental, safe changes that maintain backward compatibility where possible.
