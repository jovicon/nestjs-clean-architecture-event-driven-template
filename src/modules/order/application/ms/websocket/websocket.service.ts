import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Message, PingMessage, CreateRoomMessage, RoomMessageEvent } from './websocket.interface';

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

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: PingMessage): WsResponse<Message> {
    const { message } = data.detail.data;

    console.log('PING - data: ', data);
    console.log('PING - message: ', message);

    const { headers } = client.request;

    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`Payload: ${JSON.stringify(data)}`);

    return {
      event: 'pong',
      data: {
        message: 'world',
      },
    };
  }

  @SubscribeMessage('JoinRoom')
  async createRoom(client: Socket, data: CreateRoomMessage) {
    const { roomId } = data.detail.data;

    await client.join(roomId);
    client.to(roomId).emit('WelcomeRoom', { room: roomId });

    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`roomCreated`, `${this.constructor.name} - createRoom - Room id: ${roomId}`);

    return {
      event: 'roomCreated',
      data,
    };
  }

  @SubscribeMessage('MessageRoom')
  roomMessage(client: Socket, data: RoomMessageEvent) {
    const { roomId, message } = data.detail.data;

    client.to(roomId).emit('message', { room: roomId, message });

    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`room`, `${this.constructor.name} - roomMessage - Room id: ${roomId}`);

    return {
      event: 'MessageSended',
      data,
    };
  }
}
