import { RequestContext } from 'nestjs-request-context';
// import { DatabaseTransactionConnection } from 'slonik';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  requestId: string;

  // transactionConnection?: DatabaseTransactionConnection; // For global transactions
}

export class RequestContextService {
  // TODO: get a better way to do this (maybe a decorator) to remove of "|| { requestId: 'controller_testing' }"
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext?.req || { requestId: 'controller_testing' };
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  // static getTransactionConnection(): DatabaseTransactionConnection | undefined {
  //   const ctx = this.getContext();
  //   return ctx.transactionConnection;
  // }

  // static setTransactionConnection(transactionConnection?: DatabaseTransactionConnection): void {
  //   const ctx = this.getContext();
  //   ctx.transactionConnection = transactionConnection;
  // }

  // static cleanTransactionConnection(): void {
  //   const ctx = this.getContext();
  //   ctx.transactionConnection = undefined;
  // }
}
