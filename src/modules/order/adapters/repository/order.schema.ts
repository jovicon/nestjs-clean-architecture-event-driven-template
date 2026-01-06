import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Order {
  @Prop()
  items: string[];
}

export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);
