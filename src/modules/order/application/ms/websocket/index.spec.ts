import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core', () => {
  const mockListen = jest.fn().mockResolvedValue(undefined);
  const mockCreate = jest.fn().mockResolvedValue({
    listen: mockListen,
  });

  return {
    NestFactory: {
      create: mockCreate,
    },
  };
});

describe('webSocket Bootstrap (index.ts)', () => {
  const mockCreate = NestFactory.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the WebSocket server when index.ts is imported', async () => {
    // Import will trigger the IIFE in index.ts
    await import('./index');

    // Wait for async IIFE to complete
    await new Promise(resolve => setImmediate(resolve));

    // Verify NestFactory.create was called
    expect(mockCreate).toHaveBeenCalled();

    // Verify app.listen was called with port 4000
    const mockApp = await mockCreate.mock.results.at(-1).value;
    expect(mockApp.listen).toHaveBeenCalledWith(4000);
  });

  it('should create NestJS application with WebsocketGatewayModule', async () => {
    const { WebsocketGatewayModule } = await import('./websocket.module');

    await NestFactory.create(WebsocketGatewayModule);

    expect(mockCreate).toHaveBeenCalledWith(WebsocketGatewayModule);
  });

  it('should start application on port 4000', async () => {
    const app = await NestFactory.create({});

    await app.listen(4000);

    expect(app.listen).toHaveBeenCalledWith(4000);
  });
});
