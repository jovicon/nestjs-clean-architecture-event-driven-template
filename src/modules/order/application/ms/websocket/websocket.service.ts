import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, data: any) {
    client.join(data.roomId);
    client.to(data.roomId).emit('roomCreated', { room: data.roomId });

    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`roomCreated`, `${this.constructor.name} - createRoom - Room id: ${data.roomId}`);

    return {
      event: 'roomCreated',
      data,
    };
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    return {
      event: 'pong',
      data: {
        message: 'world',
      },
    };
  }
}
