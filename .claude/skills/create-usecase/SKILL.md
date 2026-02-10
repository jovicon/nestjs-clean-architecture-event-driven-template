---
name: create-usecase
description: Create a new use case with DTOs and module following Clean Architecture patterns. Use when adding new business workflows or operations.
argument-hint: [module-name] [usecase-name]
disable-model-invocation: true
---

Create a new use case "$1" in the $0 module.

Create the following files in src/modules/$0/application/useCases/$1/:

1. **$1.usecase.ts** - Use case implementation
2. **$1.dto.ts** - Request and Response DTOs
3. **$1.module.ts** - NestJS module (minimal, no adapter imports)

Requirements:

- Implement the UseCase<IRequest, IResponse> interface from '@shared/commons/core/UseCase'
- Return Result<T> or Either<L, R> for error handling
- Use Guard pattern for input validation
- Inject required ports/repositories via constructor
- Follow the pattern from existing use cases in the Order module
- DTOs should have proper validation decorators
- The module should only declare the use case, actual DI wiring happens in infrastructure layer

Generate complete, production-ready code following Clean Architecture principles.
