// tenants example
// this could change to a different type of tenant or names
export type Tenants = 'tenant1' | 'tenant2' | 'tenant3';

export interface EventMessageHeader {
  'detail-type': string;
  source: string;
  version?: string;
  id?: string;
  time?: Date;
  tenant?: Tenants;
  authorization?: string;
}

export interface EventMessageDetails<Data, Metadata> {
  detail: {
    data: Data;
    metadata?: Metadata;
  };
}

export interface Message {
  message: string;
}

export interface PingMessage extends EventMessageDetails<Message, {}> {}

interface CreateRoom {
  roomId: string;
}

export interface CreateRoomMessage extends EventMessageDetails<CreateRoom, {}> {}

interface RoomMessage {
  roomId: string;
  message: string;
}

export interface RoomMessageEvent extends EventMessageDetails<RoomMessage, {}> {}
