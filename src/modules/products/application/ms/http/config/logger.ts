import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const Logger = WinstonModule.forRootAsync({
  useFactory: () => ({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  }),
  inject: [],
});
