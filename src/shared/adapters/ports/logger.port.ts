/**
 * Logger Port Interface
 *
 * Defines the contract for logging services in the application.
 * This port abstracts away the concrete logging implementation (Winston, Console, etc.),
 * following the Hexagonal Architecture (Ports & Adapters) pattern.
 *
 * @remarks
 * - This is a PORT (interface), not an implementation
 * - Implementations (adapters) should handle log formatting, transport, and persistence
 * - Domain and Application layers depend on this interface for logging
 * - Ensures the application is not coupled to specific logging frameworks
 *
 * @example
 * ```typescript
 * // In application layer - depend on the port
 * constructor(
 *   @Inject('ILogger')
 *   private readonly logger: LoggerPort
 * ) {}
 *
 * // In infrastructure layer - bind port to adapter
 * {
 *   provide: 'ILogger',
 *   useClass: WinstonLoggerAdapter, // concrete implementation
 * }
 * ```
 */
export interface LoggerPort {
  /**
   * Logs an informational message
   *
   * @param message - The main log message
   * @param meta - Optional additional metadata to include with the log (objects, arrays, etc.)
   *
   * @remarks
   * - Use for standard application flow logging
   * - Should be used for important business events that are not errors
   * - Implementation may format metadata as JSON or structured logs
   *
   * @example
   * ```typescript
   * logger.log('Order created successfully', { orderId: '123', customerId: '456' });
   * logger.log('User authenticated', { userId: user.id, timestamp: new Date() });
   * ```
   */
  log(message: string, ...meta: unknown[]): void;

  /**
   * Logs an error message with optional stack trace
   *
   * @param message - The error message or description
   * @param trace - Optional error stack trace or Error object for debugging
   * @param meta - Optional additional metadata about the error context
   *
   * @remarks
   * - Use for application errors, exceptions, and failures
   * - Should include stack traces in development/staging environments
   * - Implementation may send to error tracking services (Sentry, Rollbar, etc.)
   * - Critical errors may trigger alerts in production
   *
   * @example
   * ```typescript
   * try {
   *   await processOrder(order);
   * } catch (error) {
   *   logger.error('Failed to process order', error.stack, { orderId: order.id });
   * }
   * ```
   */
  error(message: string, trace?: unknown, ...meta: unknown[]): void;

  /**
   * Logs a warning message
   *
   * @param message - The warning message
   * @param meta - Optional additional metadata about the warning context
   *
   * @remarks
   * - Use for potentially problematic situations that are not errors
   * - Should highlight deprecations, performance issues, or misconfigurations
   * - Implementation may aggregate warnings for periodic review
   *
   * @example
   * ```typescript
   * logger.warn('API rate limit approaching', { current: 950, limit: 1000 });
   * logger.warn('Deprecated method called', { method: 'oldCreateOrder', caller: 'OrderService' });
   * ```
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Logs a debug message
   *
   * @param message - The debug message
   * @param meta - Optional additional metadata for debugging
   *
   * @remarks
   * - Use for detailed diagnostic information during development
   * - Should be disabled or filtered in production environments
   * - Useful for tracing execution flow and inspecting variable states
   * - May include sensitive data - ensure proper filtering in production
   *
   * @example
   * ```typescript
   * logger.debug('Processing order items', { items: order.items, count: order.items.length });
   * logger.debug('Cache hit', { key: cacheKey, ttl: 3600 });
   * ```
   */
  debug(message: string, ...meta: unknown[]): void;
}
