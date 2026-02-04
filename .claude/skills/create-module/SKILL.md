---
name: create-module
description: Create a new feature module following Clean Architecture structure. Use when adding a new business domain or feature module to the project.
argument-hint: [module-name]
disable-model-invocation: true
---

Create a new feature module named "$0" following the Clean Architecture pattern.

Create the following directory structure in src/modules/$0/:

```
$0/
├── domain/
│   ├── $0.ts              # Main aggregate
│   └── events/                          # Domain events
│       └── .gitkeep
├── application/
│   ├── ports/                           # Interface definitions
│   │   └── $0.port.ts
│   ├── events/                          # Event handlers
│   │   └── handlers/
│   │       └── .gitkeep
│   ├── useCases/                        # Use cases
│   │   └── .gitkeep
│   └── ms/                              # Microservice entry points
│       ├── http/
│       │   └── .gitkeep
│       ├── websocket/
│       │   └── .gitkeep
│       └── tcp/
│           └── .gitkeep
├── adapters/                            # Port implementations
│   └── repository/
│       ├── $0.service.ts
│       ├── $0.adapter.ts
│       ├── $0.schema.ts
│       └── $0.module.ts
└── infrastructure/                      # NestJS wiring
    └── $0.module.ts
```

Follow these requirements:
1. Domain layer: Pure business logic, NO framework dependencies
2. Application layer: Use cases and orchestration
3. Adapters layer: Repository and external service implementations
4. Infrastructure layer: NestJS module wiring with DI configuration
5. Import only from allowed layers (respect dependency rule: Infrastructure → Adapters → Application → Domain)
6. Follow naming conventions from CLAUDE.md

Create all files with proper imports and basic structure based on the Order module example.
