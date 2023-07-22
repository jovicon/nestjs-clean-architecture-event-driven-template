import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

const paths = {
  envFilePath: `./.env`,
  packageJsonPath: `./package.json`,
};

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: ConfigService.create(paths),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
