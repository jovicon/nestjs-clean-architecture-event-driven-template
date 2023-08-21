import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

export const Logger = WinstonModule.forRootAsync({
  useFactory: () => ({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  }),
  inject: [],
});
