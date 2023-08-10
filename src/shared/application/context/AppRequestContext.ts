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
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext?.req || { requestId: '123' };
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    console.log('this.getContext()', this.getContext().requestId);
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
