import { ConfigModule } from '@nestjs/config';
import { validate as ValidateEnvHelper } from '../helpers/env.validation';

export const EnvConfigModule = ConfigModule.forRoot({
  validate: ValidateEnvHelper,
  isGlobal: true,
  envFilePath: '.env',
});
