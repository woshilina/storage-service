import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //设置可跨域
  // app.enableCors({ origin: 'https://storage-front-8ecz.onrender.com/' });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true, //详细的错误消息不会显示在响应正文中
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('管理系统 API list')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);
  await app.listen(3002);
}
bootstrap();
