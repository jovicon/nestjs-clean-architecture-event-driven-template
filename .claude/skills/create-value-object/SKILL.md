---
name: create-value-object
description: Create a new value object following DDD patterns. Use when modeling domain concepts without identity (email, money, address, etc).
argument-hint: [module-name] [value-object-name]
disable-model-invocation: true
---

Create a new value object "$1" in the $0 module.

Create file: **src/modules/$0/domain/$1.ts**

Requirements:
- Extend ValueObject<Props> from '@shared/ddd/ValueObject'
- Immutable - no setters, only getters
- Equality based on values, not identity
- Private constructor with static create() factory method
- Validation in create() method using Guard pattern
- Return Result<ValueObjectName> from create()
- NO framework dependencies

Value Object characteristics:
- Measures, quantifies, or describes a domain concept
- Immutable
- Compared by value equality
- Side-effect free behavior
- Self-validated

Example value objects:
- Email (validates email format)
- Money (amount + currency)
- Address (street, city, country)
- DateRange (start + end dates)

Follow the ValueObject pattern from existing examples in the codebase.
