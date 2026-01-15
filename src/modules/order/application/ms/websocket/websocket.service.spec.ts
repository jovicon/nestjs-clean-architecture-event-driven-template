import { Socket } from 'socket.io';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WebsocketGateway } from './websocket.service';
import { WebsocketGatewayModule } from './websocket.module';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('WebsocketGateway', () => {
  let websocketGateway: WebsocketGateway;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createNestApp(WebsocketGateway);
    app.listen(4000);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketGateway, Logger],
    }).compile();

    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);

    (websocketGateway.io as any) = { sockets: { sockets: { size: 1 } } };
  });

  it('should be defined', () => {
    expect(websocketGateway).toBeDefined();
  });

  it('should handle connection', () => {
    const client = { id: 'test-client-id' } as Socket;
    const loggerSpy = jest.spyOn(websocketGateway['logger'], 'log');

    websocketGateway.handleConnection(client);

    expect(loggerSpy).toHaveBeenCalledWith(`Client id: ${client.id} connected`);
    expect(loggerSpy).toHaveBeenCalledWith(`Number of connected clients: 1`);
  });

  it('should handle disconnection', () => {
    const client = { id: 'test-client-id' } as Socket;
    const loggerSpy = jest.spyOn(websocketGateway['logger'], 'log');

    websocketGateway.handleDisconnect(client);

    expect(loggerSpy).toHaveBeenCalledWith(`Cliend id:${client.id} disconnected`);
  });

  it('should handle "ping" message', () => {
    const client = { id: 'test-client-id', request: { headers: {} } } as Socket;
    const data = {
      detail: {
        data: {
          message: 'hello',
        },
      },
    };

    const loggerSpy = jest.spyOn(websocketGateway['logger'], 'log');

    const result = websocketGateway.handleMessage(client, data);

    expect(loggerSpy).toHaveBeenCalledWith(`Message received from client id: ${client.id}`);
    expect(loggerSpy).toHaveBeenCalledWith(`Payload: ${JSON.stringify(data)}`);

    expect(result).toEqual({
      event: 'pong',
      data: {
        message: 'world',
      },
    });
  });

  it('should handle "JoinRoom" message', async () => {
    const data = {
      detail: {
        data: { roomId: 'test-room-id' },
      },
    };
    const loggerSpy = jest.spyOn(websocketGateway['logger'], 'log');

    const client = {
      id: 'test-client-id',
      join: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
      emit: jest.fn(),
    } as unknown as Socket;

    const result = await websocketGateway.createRoom(client, data);

    expect(client.join).toHaveBeenCalledWith(data.detail.data.roomId);
    expect(client.to).toHaveBeenCalledWith(data.detail.data.roomId);
    expect(loggerSpy).toHaveBeenCalledWith(`Message received from client id: ${client.id}`);
    expect(loggerSpy).toHaveBeenCalledWith(
      `roomCreated`,
      `${websocketGateway.constructor.name} - createRoom - Room id: ${data.detail.data.roomId}`
    );
    expect(result).toEqual({
      event: 'roomCreated',
      data,
    });
  });

  it('should handle "roomMessage" message', () => {
    const client = {
      id: 'test-client-id',
      join: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as unknown as Socket;

    const data = {
      detail: {
        data: {
          roomId: 'test-room-id',
          message: 'hello',
        },
      },
    };
    const loggerSpy = jest.spyOn(websocketGateway['logger'], 'log');

    const result = websocketGateway.roomMessage(client, data);

    expect(client.to).toHaveBeenCalledWith(data.detail.data.roomId);
    expect(loggerSpy).toHaveBeenCalledWith(`Message received from client id: ${client.id}`);
    expect(loggerSpy).toHaveBeenCalledWith(
      `room`,
      `${websocketGateway.constructor.name} - roomMessage - Room id: ${data.detail.data.roomId}`
    );
    expect(result).toEqual({
      event: 'MessageSended',
      data,
    });
  });
});

describe('WebsocketGatewayModule', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WebsocketGatewayModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide WebsocketGateway', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WebsocketGatewayModule],
    }).compile();

    const gateway = module.get<WebsocketGateway>(WebsocketGateway);
    expect(gateway).toBeDefined();
    expect(gateway).toBeInstanceOf(WebsocketGateway);
  });

  it('should export WebsocketGateway', async () => {
    const parentModule: TestingModule = await Test.createTestingModule({
      imports: [WebsocketGatewayModule],
    }).compile();

    const gateway = parentModule.get<WebsocketGateway>(WebsocketGateway);
    expect(gateway).toBeDefined();
  });
});
