import { ExeptionFilterModule } from '@core/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, HealthModule, InitialModule } from 'be-core';
import { load, MongoDbConnectionConfig } from './config';
import { modules } from './modules';

@Module({
  imports: [
    InitialModule,
    ExeptionFilterModule,
    HealthModule,
    CacheModule,
    ConfigModule.forRoot({
      load: [load],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const connection = configService.get<MongoDbConnectionConfig>('mongoDbConnection');

        const connectionOptions = {
          "mongodb": () => {
            return {
              ...connection
            }
          }
        }[connection?.type ?? 'mongodb']()

        return {
          ...connectionOptions,
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          synchronize: true,
          retryAttempts: 3,
          retryDelay: 1000,
          useUnifiedTopology: true,
          forceServerObjectId: true,
          autoLoadEntities: true
        }
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ...modules
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {
}
