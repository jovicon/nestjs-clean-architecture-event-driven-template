---
name: generate-tests
description: Generate comprehensive tests for use cases, entities, repositories, and endpoints. Use when adding tests for existing code or achieving better coverage.
argument-hint: [target] [test-type]
disable-model-invocation: true
---

Generate comprehensive tests for: **$0**

**Test type:** $1 (options: unit, integration, e2e, all - default: unit)

## Test Generation Strategy

### 1. Identify Target Type

First, determine what type of code we're testing:

**If Use Case:**
- Location: `src/modules/*/application/useCases/*/[UseCase].usecase.ts`
- Generate: Unit tests for use case logic
- Test file: `[UseCase].usecase.spec.ts` (same directory)

**If Domain Entity/Aggregate:**
- Location: `src/modules/*/domain/[Entity].ts`
- Generate: Unit tests for domain logic
- Test file: `[Entity].spec.ts` (same directory)

**If Value Object:**
- Location: `src/modules/*/domain/[ValueObject].ts`
- Generate: Unit tests for value object validation
- Test file: `[ValueObject].spec.ts` (same directory)

**If Repository:**
- Location: `src/modules/*/adapters/repository/[Entity].adapter.ts`
- Generate: Integration tests with database mocking
- Test file: `[Entity].adapter.spec.ts` (same directory)

**If HTTP Controller:**
- Location: `src/modules/*/application/ms/http/[controller].ts`
- Generate: E2E tests for API endpoints
- Test file: `test/e2e/[module]-[controller].e2e-spec.ts`

**If Event Handler:**
- Location: `src/modules/*/application/events/handlers/[Handler].ts`
- Generate: Unit tests for event handling
- Test file: `[Handler].spec.ts` (same directory)

---

## Test Templates by Type

### Unit Tests - Use Case

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { [UseCaseName]UseCase } from './[UseCaseName].usecase';
import { [UseCaseName]DTO } from './[UseCaseName].dto';
import { Result } from '@shared/commons/core/Result';

describe('[UseCaseName]UseCase', () => {
  let useCase: [UseCaseName]UseCase;
  let mockRepository: jest.Mocked<any>;
  let mockService: jest.Mocked<any>;

  beforeEach(async () => {
    // Create mocks for injected dependencies
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    mockService = {
      someMethod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        [UseCaseName]UseCase,
        {
          provide: 'IRepository',
          useValue: mockRepository,
        },
        {
          provide: 'IService',
          useValue: mockService,
        },
      ],
    }).compile();

    useCase = module.get<[UseCaseName]UseCase>([UseCaseName]UseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    describe('success cases', () => {
      it('should successfully execute with valid input', async () => {
        // Arrange
        const dto: [UseCaseName]DTO = {
          // valid test data
        };

        const expectedResult = {
          // expected output
        };

        mockRepository.save.mockResolvedValue(expectedResult);

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toEqual(expectedResult);
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            // verify saved data
          })
        );
      });

      it('should handle edge case: [specific scenario]', async () => {
        // Test edge cases
      });
    });

    describe('failure cases', () => {
      it('should fail with invalid input: [specific validation]', async () => {
        // Arrange
        const invalidDto: [UseCaseName]DTO = {
          // invalid test data
        };

        // Act
        const result = await useCase.execute(invalidDto);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('[expected error message]');
        expect(mockRepository.save).not.toHaveBeenCalled();
      });

      it('should fail when repository throws error', async () => {
        // Arrange
        const dto: [UseCaseName]DTO = { /* valid data */ };
        mockRepository.save.mockRejectedValue(new Error('Database error'));

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('Database error');
      });

      it('should fail when business rule violated: [rule name]', async () => {
        // Test business rule violations
      });
    });

    describe('side effects', () => {
      it('should publish domain events after successful execution', async () => {
        // Test event publishing if applicable
      });

      it('should not publish events on failure', async () => {
        // Verify no side effects on failure
      });
    });
  });
});
```

---

### Unit Tests - Domain Entity/Aggregate

```typescript
import { [Entity] } from './[Entity]';
import { Result } from '@shared/commons/core/Result';
import { UniqueEntityID } from '@shared/ddd/UniqueEntityID';

describe('[Entity]', () => {
  describe('create', () => {
    describe('success cases', () => {
      it('should create entity with valid props', () => {
        // Arrange
        const props = {
          // valid properties
        };

        // Act
        const result = [Entity].create(props);

        // Assert
        expect(result.isSuccess).toBe(true);
        const entity = result.getValue();
        expect(entity).toBeInstanceOf([Entity]);
        expect(entity.propName).toBe(props.propName);
      });

      it('should create entity with optional ID', () => {
        // Arrange
        const props = { /* valid props */ };
        const id = new UniqueEntityID('test-id');

        // Act
        const result = [Entity].create(props, id);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().id.toString()).toBe('test-id');
      });
    });

    describe('failure cases - validation', () => {
      it('should fail when required field is null', () => {
        // Arrange
        const props = {
          requiredField: null,
          // other fields
        };

        // Act
        const result = [Entity].create(props);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('requiredField');
      });

      it('should fail when required field is undefined', () => {
        // Test undefined validation
      });

      it('should fail with invalid data type', () => {
        // Test type validation
      });
    });

    describe('failure cases - business rules', () => {
      it('should fail when business rule violated: [rule name]', () => {
        // Arrange
        const props = {
          // data that violates business rule
        };

        // Act
        const result = [Entity].create(props);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('[business rule error]');
      });
    });
  });

  describe('business methods', () => {
    let entity: [Entity];

    beforeEach(() => {
      const result = [Entity].create({ /* valid props */ });
      entity = result.getValue();
    });

    describe('methodName', () => {
      it('should successfully execute method with valid state', () => {
        // Arrange
        const input = /* method parameters */;

        // Act
        const result = entity.methodName(input);

        // Assert
        expect(result.isSuccess).toBe(true);
        // Verify state changes
      });

      it('should fail when precondition not met', () => {
        // Test precondition failures
      });

      it('should maintain invariants after method execution', () => {
        // Test invariants
      });
    });
  });

  describe('domain events', () => {
    it('should add domain event when [action occurs]', () => {
      // Arrange
      const props = { /* valid props */ };

      // Act
      const result = [Entity].create(props);
      const entity = result.getValue();

      // Assert
      const events = entity.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf([EventClass]);
    });

    it('should clear domain events', () => {
      // Test event clearing
    });
  });
});
```

---

### Unit Tests - Value Object

```typescript
import { [ValueObject] } from './[ValueObject]';
import { Result } from '@shared/commons/core/Result';

describe('[ValueObject]', () => {
  describe('create', () => {
    describe('success cases', () => {
      it('should create value object with valid value', () => {
        // Arrange
        const validValue = /* valid data */;

        // Act
        const result = [ValueObject].create(validValue);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe(validValue);
      });

      it('should create with different valid formats', () => {
        // Test various valid formats
      });
    });

    describe('failure cases', () => {
      it('should fail with null value', () => {
        // Act
        const result = [ValueObject].create(null);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('null');
      });

      it('should fail with invalid format: [format type]', () => {
        // Arrange
        const invalidValue = /* invalid data */;

        // Act
        const result = [ValueObject].create(invalidValue);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('[validation error]');
      });

      it('should fail when exceeds maximum: [constraint]', () => {
        // Test upper bounds
      });

      it('should fail when below minimum: [constraint]', () => {
        // Test lower bounds
      });
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const value1 = [ValueObject].create('test').getValue();
      const value2 = [ValueObject].create('test').getValue();

      // Act & Assert
      expect(value1.equals(value2)).toBe(true);
    });

    it('should not be equal when values differ', () => {
      // Arrange
      const value1 = [ValueObject].create('test1').getValue();
      const value2 = [ValueObject].create('test2').getValue();

      // Act & Assert
      expect(value1.equals(value2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not allow modification after creation', () => {
      // Verify immutability
    });
  });

  describe('behavior methods', () => {
    it('should correctly execute: [method name]', () => {
      // Test value object methods
    });
  });
});
```

---

### Integration Tests - Repository

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { [Entity]RepositoryAdapter } from './[Entity].adapter';
import { [Entity] } from '../../domain/[Entity]';

describe('[Entity]RepositoryAdapter (Integration)', () => {
  let repository: [Entity]RepositoryAdapter;
  let model: jest.Mocked<Model<any>>;

  beforeEach(async () => {
    // Create mock Mongoose model
    model = {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        [Entity]RepositoryAdapter,
        {
          provide: getModelToken('[Entity]'),
          useValue: model,
        },
      ],
    }).compile();

    repository = module.get<[Entity]RepositoryAdapter>([Entity]RepositoryAdapter);
  });

  describe('save', () => {
    it('should save entity to database', async () => {
      // Arrange
      const entity = [Entity].create({ /* props */ }).getValue();
      const mockDoc = { _id: 'test-id', /* properties */ };
      model.create.mockResolvedValue(mockDoc as any);

      // Act
      const result = await repository.save(entity);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          // verify persistence mapping
        })
      );
    });

    it('should handle database errors', async () => {
      // Arrange
      const entity = [Entity].create({ /* props */ }).getValue();
      model.create.mockRejectedValue(new Error('DB Error'));

      // Act
      const result = await repository.save(entity);

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  describe('findById', () => {
    it('should find entity by ID', async () => {
      // Arrange
      const mockDoc = { _id: 'test-id', /* properties */ };
      model.findById.mockResolvedValue(mockDoc);

      // Act
      const result = await repository.findById('test-id');

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf([Entity]);
    });

    it('should return failure when entity not found', async () => {
      // Arrange
      model.findById.mockResolvedValue(null);

      // Act
      const result = await repository.findById('non-existent');

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('not found');
    });
  });

  describe('domain to persistence mapping', () => {
    it('should correctly map domain entity to database document', () => {
      // Test toPersistence mapping
    });

    it('should correctly map database document to domain entity', () => {
      // Test toDomain mapping
    });
  });
});
```

---

### E2E Tests - HTTP Endpoints

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('[Module] - [Controller] (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /[endpoint]', () => {
    it('should create resource with valid data', () => {
      return request(app.getHttpServer())
        .post('/[endpoint]')
        .send({
          // valid request body
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.propertyName).toBe('expectedValue');
        });
    });

    it('should return 400 with invalid data', () => {
      return request(app.getHttpServer())
        .post('/[endpoint]')
        .send({
          // invalid request body
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('validation');
        });
    });

    it('should return 401 without authentication', () => {
      // Test authentication if applicable
    });
  });

  describe('GET /[endpoint]/:id', () => {
    it('should retrieve resource by ID', () => {
      // First create a resource
      // Then retrieve it
    });

    it('should return 404 for non-existent resource', () => {
      return request(app.getHttpServer())
        .get('/[endpoint]/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /[endpoint]/:id', () => {
    it('should update existing resource', () => {
      // Test update functionality
    });
  });

  describe('DELETE /[endpoint]/:id', () => {
    it('should delete existing resource', () => {
      // Test delete functionality
    });
  });
});
```

---

## Test Generation Requirements

1. **Read the target file** to understand:
   - Class structure and dependencies
   - Public methods and their signatures
   - Business logic and validation rules
   - Result/Either return types

2. **Generate tests covering:**
   - ✅ **Success paths** - Happy path scenarios
   - ✅ **Failure paths** - Validation failures, business rule violations
   - ✅ **Edge cases** - Boundary values, null/undefined, empty arrays
   - ✅ **Error handling** - Repository errors, external service failures
   - ✅ **Side effects** - Domain events, state changes
   - ✅ **Invariants** - Business rules maintained after operations

3. **Follow testing best practices:**
   - Use Arrange-Act-Assert (AAA) pattern
   - Descriptive test names: `should [expected behavior] when [condition]`
   - One assertion concept per test
   - Proper mocking of dependencies
   - Clear test data setup
   - Cleanup in afterEach/afterAll

4. **Use existing test patterns:**
   - Reference existing tests in the codebase
   - Follow project conventions (imports, formatting)
   - Use project-specific test utilities
   - Match existing mock patterns

5. **Coverage targets:**
   - Statements: 100%
   - Branches: 100%
   - Functions: 100%
   - Lines: 100%

## Output

Generate the complete test file with:
- All necessary imports
- Proper describe/it structure
- Comprehensive test cases
- Helpful comments
- Mock setup and teardown
- Test data fixtures
- Expected results assertions

Place the test file in the correct location based on test type and project structure.
