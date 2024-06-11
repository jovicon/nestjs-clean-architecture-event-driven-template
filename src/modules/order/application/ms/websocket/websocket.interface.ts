export type Tenants = 'tenant1' | 'tenant2' | 'tenant3'; // tenants example

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
