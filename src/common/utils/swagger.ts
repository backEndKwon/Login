import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setUpSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('로그인 빌드과정 연습용 API Docs')
    .setDescription('로그인 빌드 과정의 각종 토큰 및 검증 과정 연습')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
