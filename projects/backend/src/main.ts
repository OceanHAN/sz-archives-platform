import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 开启跨域（允许本地前端开发端口访问）
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
    credentials: true,
  });

  // 静态资源托管：用于访问上传后的文件（/uploads/**）
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 启动服务：默认端口 3000，可通过环境变量覆盖
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
