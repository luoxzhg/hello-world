import { NestFactory } from '@nestjs/core';
import { Some/appModule } from './some/app.module';

async function bootstrap() {
  const app = await NestFactory.create(Some/appModule);
  await app.listen(3000);
}
bootstrap();
