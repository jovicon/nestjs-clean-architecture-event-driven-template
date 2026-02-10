---
name: create-repository
description: Create repository adapter with MongoDB schema following the ports & adapters pattern. Use when adding persistence for domain entities.
argument-hint: [module-name] [entity-name]
disable-model-invocation: true
---

Create repository infrastructure for "$1" entity in the $0 module.

Create these files in src/modules/$0/adapters/repository/:

1. **$1.schema.ts** - Mongoose schema definition
2. **$1.adapter.ts** - Repository adapter implementing IRepository
3. **$1.service.ts** - Service implementing the port interface
4. **$1.module.ts** - Adapter module for DI

Also create the port interface: 5. **src/modules/$0/application/ports/$1.port.ts**

Requirements:

- Schema: Use Mongoose decorators (@Schema, @Prop) from @nestjs/mongoose
- Adapter: Implement generic IRepository<T> interface
- Service: Implement the port interface defined in application layer
- Follow Repository pattern from shared/adapters/repository/
- Map between domain entities and database models
- Handle persistence concerns (MongoDB)
- Return domain entities, not database models
- Use proper error handling with Result pattern

Layer responsibilities:

- Port (application): Interface definition
- Adapter (adapters): Repository implementation
- Schema (adapters): Database mapping
- Module (adapters): DI configuration for adapters only
