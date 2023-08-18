import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiController } from './api.controller';
import ClientsService from './api.service';
import { CreateOrderModule } from '../../useCases/CreateOrder/CreateOrder.module';

@Module({
  imports: [
    ClientsModule.register([{ name: 'LOGGER_SERVICE', options: { host: 'localhost:3001' }, transport: Transport.TCP }]),
    CreateOrderModule,
  ],
  controllers: [ApiController],
  providers: [ClientsService],
})
export class OrderModule {}
