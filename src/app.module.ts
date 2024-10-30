import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { DbModuleProvider } from './common/config/db';
import { EnvConfigModule } from './common/config/env';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    EnvConfigModule,
    DbModuleProvider,
    UserModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
