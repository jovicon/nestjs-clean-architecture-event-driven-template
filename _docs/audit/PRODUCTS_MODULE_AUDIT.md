# Products Module - Layer Boundary Violations Audit

**Date:** 2026-01-10
**Status:** 🔴 **CRITICAL - Multiple violations found**

---

## 🔴 Critical Violations Found

### 1. **Domain Layer Violations**

#### ❌ `domain/events/emitters/orderCreated.emitter.ts`

```typescript
import { OrderItem } from '@modules/order/domain/orderItem'; // ❌ Cross-module domain import
```

**Problem:** Domain layer importing from another module's domain layer.
**Impact:** Tight coupling between modules at domain level.
**Fix Required:** Use local OrderItem or shared kernel.

---

### 2. **Application Layer Violations**

#### ❌ `application/events/orderCreated.handler.ts`

```typescript
import { OrderCreated } from '@base/src/modules/order/domain/events/orderCreated'; // ❌ Importing from other module's domain
```

**Problem:** Application layer importing domain events from another module.
**Impact:** Violates bounded context separation.
**Fix Required:** Listen to shared events or use message bus.

#### ❌ `application/ms/http/http.module.ts`

```typescript
import { OrderCreatedEventHandler } from '@base/src/modules/order/application/events/orderCreated.handler'; // ❌
```

**Problem:** Importing event handler from another module's application layer.
**Impact:** Breaks module independence.
**Fix Required:** Create local event handler or use shared infrastructure.

#### ❌ `application/ms/http/api/api.service.ts`

```typescript
import { CreateOrderDTO } from '@modules/order/application/ports/orderService.port'; // ❌
```

**Problem:** Importing DTO from another module.
**Impact:** Dependency on other module's contracts.
**Fix Required:** Define own DTOs in local ports.

---

### 3. **Adapter Layer Violations**

#### ❌ `adapters/repository/order.interface.ts`

```typescript
import { OrderProps } from '@modules/order/domain/order'; // ❌ Cross-module domain import
```

**Problem:** Adapter importing domain types from another module.
**Impact:** Tight coupling at infrastructure level.

#### ❌ `adapters/repository/order.service.ts`

```typescript
import { Order as OrderEntity } from '@modules/order/domain/order'; // ❌ Cross-module domain import
```

**Problem:** Adapter importing domain entities from another module.
**Impact:** Violates dependency inversion.

---

### 4. **Infrastructure Layer Violations**

#### ❌ `infrastructure/product.module.ts`

```typescript
import { OrderRepositoryAdapter } from '@modules/order/adapters/repository/order.adapter'; // ❌
import { OrderRepositoryModule } from '@modules/order/adapters/repository/order.module'; // ❌
import { OrderService } from '@modules/order/adapters/repository/order.service'; // ❌
```

**Problem:** Infrastructure layer importing ALL adapters from order module.
**Impact:** Products module is completely dependent on Order module implementation.
**Fix Required:** Create own repository or use shared repository pattern.

---

## 🎯 Root Cause Analysis

The `products` module appears to be a **copy-paste of the `order` module** with minimal changes. It's not actually a "products" module - it's still managing orders.

**Evidence:**

1. Files named `order.*` instead of `product.*`
2. Domain entities are `Order` and `OrderItem` not `Product`
3. All repositories and services reference Order module
4. Event handlers react to Order events

---

## 📋 Recommended Fixes

### Option 1: **Rename to Order Module v2 (Quick Fix)**

Since this is actually an order module, rename it properly:

- `src/modules/products/` → `src/modules/orders-v2/` or remove it

### Option 2: **Create Real Products Module (Proper Fix)**

```
src/modules/products/
├── domain/
│   ├── product.ts              # Product aggregate
│   ├── productCategory.ts      # Value object
│   └── events/
│       └── productCreated.ts
├── application/
│   ├── ports/
│   │   └── productService.port.ts
│   └── useCases/
│       └── CreateProduct/
├── adapters/
│   └── repository/
│       ├── product.adapter.ts
│       ├── product.schema.ts
│       └── product.service.ts
└── infrastructure/
    └── product.module.ts
```

### Option 3: **Delete if Unused (Recommended for Template)**

If this is just example code in the template, remove it to avoid confusion.

---

## 🔧 Immediate Actions Required

1. ❌ **DO NOT** use this module in production
2. ✅ Decide: Rename, Refactor, or Remove
3. ✅ If keeping: Create proper Product domain
4. ✅ Remove all cross-module imports
5. ✅ Create infrastructure layer properly

---

## ✅ What Order Module Does Correctly

For reference, the `order` module follows clean architecture:

- ✅ Domain layer has zero framework dependencies
- ✅ Application uses ports (interfaces)
- ✅ Infrastructure wires dependencies
- ✅ Event handlers in application layer

**Copy this pattern, don't copy the implementation!**

---

## Summary

| Layer          | Violations | Status          |
| -------------- | ---------- | --------------- |
| Domain         | 2          | 🔴 Critical     |
| Application    | 4          | 🔴 Critical     |
| Adapters       | 2          | 🔴 Critical     |
| Infrastructure | 3          | 🔴 Critical     |
| **TOTAL**      | **11**     | 🔴 **CRITICAL** |

**Conclusion:** Products module violates clean architecture principles at every layer.
