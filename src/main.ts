import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { logLevel } from '@nestjs/microservices/external/kafka.interface';
import { log } from '@utils/debug/logger';
import { AppModule } from './app.module';
import { KafkaConfig } from './config';


const connectKafka = async (app: INestApplication) => {
  const configService = app.get(ConfigService)
  const kafkaConfig = configService.get<KafkaConfig>('kafka');
  if (!kafkaConfig || !kafkaConfig.enable) return;

  const kafkaApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaConfig.brokers,
        logLevel: logLevel.ERROR,
      },
      consumer: {
        groupId: kafkaConfig.consumerGroupId,
      },
    },
  })
  await kafkaApp.listen()
  log('Kafka connected')
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT)
  await app.listen(port);
  await connectKafka(app)
  log(`App listen on port ${port}`)
}
bootstrap();
