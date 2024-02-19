import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//utils/swagger에서 swagger관련 setting후 main에 등록
import { setUpSwagger } from './common/utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setUpSwagger(app);
  await app.listen(3000);
}
bootstrap();
