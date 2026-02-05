import { UniqueEntityID } from './UniqueEntityID';

describe('UniqueEntityID', () => {
  describe('constructor', () => {
    it('should generate a unique ID when no ID is provided', () => {
      const entityId = new UniqueEntityID();

      expect(entityId.id).toBeDefined();
      expect(typeof entityId.id).toBe('string');
      expect(entityId.id.length).toBeGreaterThan(0);
    });

    it('should use provided ID when given', () => {
      const providedId = 'custom-id-12345';
      const entityId = new UniqueEntityID(providedId);

      expect(entityId.id).toBe(providedId);
    });

    it('should generate different IDs for different instances', () => {
      const entityId1 = new UniqueEntityID();
      const entityId2 = new UniqueEntityID();

      expect(entityId1.id).not.toBe(entityId2.id);
    });

    it('should accept empty string as ID', () => {
      const entityId = new UniqueEntityID('');

      expect(entityId.id).toBe('');
    });

    it('should accept special characters in ID', () => {
      const specialId = 'id-with-special-@#$%^&*()';
      const entityId = new UniqueEntityID(specialId);

      expect(entityId.id).toBe(specialId);
    });

    it('should accept UUID-format ID', () => {
      const uuidId = '550e8400-e29b-41d4-a716-446655440000';
      const entityId = new UniqueEntityID(uuidId);

      expect(entityId.id).toBe(uuidId);
    });

    it('should accept numeric string as ID', () => {
      const numericId = '123456789';
      const entityId = new UniqueEntityID(numericId);

      expect(entityId.id).toBe(numericId);
    });
  });

  describe('id getter', () => {
    it('should return the same ID consistently', () => {
      const entityId = new UniqueEntityID('consistent-id');

      expect(entityId.id).toBe('consistent-id');
      expect(entityId.id).toBe('consistent-id');
    });

    it('should return generated ID consistently', () => {
      const entityId = new UniqueEntityID();
      const firstAccess = entityId.id;
      const secondAccess = entityId.id;

      expect(firstAccess).toBe(secondAccess);
    });
  });

  describe('ID generation', () => {
    it('should generate nanoid-style IDs', () => {
      const entityId = new UniqueEntityID();

      // nanoid generates URL-friendly IDs with specific character set
      expect(entityId.id).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should generate IDs with reasonable length', () => {
      const entityId = new UniqueEntityID();

      // Default nanoid length is 21 characters
      expect(entityId.id.length).toBeGreaterThanOrEqual(10);
      expect(entityId.id.length).toBeLessThanOrEqual(30);
    });

    it('should generate unique IDs across multiple creations', () => {
      const ids = new Set<string>();
      const count = 100;

      for (let i = 0; i < count; i++) {
        const entityId = new UniqueEntityID();
        ids.add(entityId.id);
      }

      expect(ids.size).toBe(count);
    });
  });
});
