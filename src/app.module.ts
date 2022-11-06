import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule, InitialModule, CacheModule } from 'be-core';
import { ConnectionConfig, load } from './config';
import { modules } from './modules';

@Module({
  imports: [
    InitialModule,
    HealthModule,
    CacheModule,
    ConfigModule.forRoot({
      load: [load],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const connectionConfig = configService.get<ConnectionConfig>('connection');

        const connectionOptions = {
          "mongodb": () => {
            return {
              ...connectionConfig
            }
          }
        }[connectionConfig?.type ?? 'mongodb']()

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
  providers: [],
})
export class AppModule {}
