import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

const Entities = [User];

export const DbModuleProvider = TypeOrmModule.forRootAsync({
  useFactory(config: ConfigService) {
    const isDev = config.get('APP_IS_DEV') === 'true';
    return {
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: Entities,
      synchronize: true,
      retryAttempts: 3,
      useUTC: true,
      timezone: 'Z',
      ssl: !isDev,
      // dropSchema: true,
    };
  },
  inject: [ConfigService],
});
