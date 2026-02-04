---
name: create-domain-event
description: Create a domain event and its handler following DDD patterns. Use when you need to publish domain events for asynchronous reactions.
argument-hint: [module-name] [event-name]
disable-model-invocation: true
---

Create a domain event "$1" and its handler in the $0 module.

Create these files:

1. **src/modules/$0/domain/events/$1.ts**
   - Pure data event extending DomainEvent base class
   - NO framework decorators (no @Injectable, @OnEvent)
   - Only domain data

2. **src/modules/$0/application/events/handlers/$1.handler.ts**
   - Event handler with framework support
   - Use @Injectable() and @OnEvent() decorators
   - Implement business logic that reacts to the event

Requirements:
- Domain Event (domain layer): Pure TypeScript, extends DomainEvent from '@shared/ddd/DomainEvent.base'
- Event Handler (application layer): NestJS decorators, implements IEventHandler
- Follow the pattern: Domain emits data-only events, Application reacts with handlers
- Reference the OrderCreated event and handler as examples

IMPORTANT: Respect layer boundaries:
- Domain events = Pure data, no framework dependencies
- Event handlers = Framework integration (@Injectable, @OnEvent)
