---
name: create-entity
description: Create a new domain entity or aggregate root following DDD patterns. Use when modeling business entities with identity and lifecycle.
argument-hint: [module-name] [entity-name] [is-aggregate:yes|no]
disable-model-invocation: true
---

Create a new domain entity "$1" in the $0 module.

Create file: **src/modules/$0/domain/$1.ts**

**Is this an aggregate root?** $2 (default: yes)

Requirements:

**If aggregate root (default):**

- Extend AggregateRoot<Props> from '@shared/ddd/AggregateRoot'
- Include domain event publishing capability
- Control transaction boundaries

**If regular entity:**

- Extend Entity<Props> from '@shared/ddd/Entity'

**Common requirements for both:**

- Use private constructor with static create() factory method
- Include props interface for entity properties
- Use UniqueEntityID for identity
- Implement business logic methods (not just getters/setters)
- Use Guard pattern for validation in the create() method
- Return Result<EntityName> from create() method
- Pure business logic - NO framework dependencies

Follow DDD principles:

- Encapsulate business rules
- Protect invariants
- Use domain language
- Keep logic in the domain layer

Reference the Order aggregate as an example.
