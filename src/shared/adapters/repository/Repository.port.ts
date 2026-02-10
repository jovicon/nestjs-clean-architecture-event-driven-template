/**
 * Repository Port Interface
 *
 * Generic repository pattern interface for data persistence operations.
 * This port defines the contract that all repository adapters must implement,
 * following the Hexagonal Architecture (Ports & Adapters) pattern.
 *
 * @template T - The entity or data transfer object type managed by the repository
 *
 * @remarks
 * - This is a PORT (interface), not an implementation
 * - Implementations (adapters) live in specific adapter directories (e.g., mongoose/, elastic/)
 * - Domain and Application layers depend on this interface, never on concrete implementations
 * - This ensures the Dependency Inversion Principle is followed
 *
 * @example
 * ```typescript
 * // In application layer - depend on the port
 * constructor(
 *   @Inject('IOrderRepository')
 *   private readonly orderRepository: Repository<Order>
 * ) {}
 *
 * // In infrastructure layer - bind port to adapter
 * {
 *   provide: 'IOrderRepository',
 *   useClass: MongoOrderRepository, // concrete implementation
 * }
 * ```
 */
export interface Repository<T> {
  /**
   * Creates a new entity in the repository
   *
   * @param data - The entity data to persist
   * @returns Promise resolving to the created entity with any generated fields (e.g., ID, timestamps)
   *
   * @throws May throw repository-specific errors (network, validation, constraint violations)
   *
   * @example
   * ```typescript
   * const order = await repository.create({
   *   customerId: '123',
   *   items: [...],
   *   totalAmount: 99.99
   * });
   * ```
   */
  create: (data: T) => Promise<T>;

  /**
   * Updates an existing entity by its unique identifier
   *
   * @param id - The unique identifier of the entity to update
   * @param data - Partial or complete entity data to update
   * @returns Promise resolving to the updated entity
   *
   * @throws May throw if entity not found or update fails
   *
   * @remarks
   * - Implementation should handle partial updates appropriately
   * - May perform optimistic locking if supported by the adapter
   * - Should validate the ID exists before attempting update
   *
   * @example
   * ```typescript
   * const updated = await repository.update('order-123', {
   *   status: 'shipped',
   *   shippedAt: new Date()
   * });
   * ```
   */
  update: (id: string, data: T) => Promise<T>;

  /**
   * Deletes an entity by its unique identifier
   *
   * @param id - The unique identifier of the entity to delete
   * @returns Promise resolving to the deleted entity (useful for audit trails)
   *
   * @throws May throw if entity not found or deletion fails
   *
   * @remarks
   * - Implementation may perform soft delete or hard delete based on adapter configuration
   * - Should handle cascading deletes if needed by the domain
   * - Returns the deleted entity for audit/logging purposes
   *
   * @example
   * ```typescript
   * const deleted = await repository.delete('order-123');
   * console.log(`Deleted order: ${deleted.id}`);
   * ```
   */
  delete: (id: string) => Promise<T>;

  /**
   * Finds a single entity by its unique identifier
   *
   * @param id - The unique identifier of the entity to find
   * @returns Promise resolving to the found entity, or null/undefined if not found
   *
   * @remarks
   * - Return type is intentionally `any` to allow flexibility in adapter implementations
   * - Adapters should return `null` or `undefined` if entity is not found
   * - Should NOT throw on "not found" - use null/undefined instead
   * - May include populated/joined relations based on adapter configuration
   *
   * @todo Consider making return type `Promise<T | null>` for better type safety
   *
   * @example
   * ```typescript
   * const order = await repository.find('order-123');
   * if (!order) {
   *   return Result.fail('Order not found');
   * }
   * ```
   */
  find: (id: string) => Promise<any>;

  /**
   * Retrieves all entities from the repository
   *
   * @returns Promise resolving to an array of all entities
   *
   * @remarks
   * - Use with caution on large datasets - consider adding pagination support
   * - May include filters/criteria in future versions
   * - Should return empty array if no entities exist
   *
   * @todo Consider adding pagination parameters (offset, limit, cursor)
   * @todo Consider adding filtering/query criteria parameter
   *
   * @example
   * ```typescript
   * const allOrders = await repository.findAll();
   * console.log(`Total orders: ${allOrders.length}`);
   * ```
   */
  findAll: () => Promise<T[]>;
}
