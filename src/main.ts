import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT)
  await app.listen(port);
  new Logger().log(`App listen on port ${port}`)
}
bootstrap();
