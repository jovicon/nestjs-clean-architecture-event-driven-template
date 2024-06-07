import { Module } from '@nestjs/common';

import { WebsocketGateway } from './websocket.service';

@Module({
  imports: [],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketGatewayModule {}
