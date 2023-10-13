import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApplicationSocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  console.log('start')
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('EMRS api')
    .setDescription('The Electronic Medical Record System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService<IconfigService>);
  const serverPort = configService.get<number>('SERVER_PORT');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false, // Allow sending cookies from the client
  });

  app.useWebSocketAdapter(new ApplicationSocketIOAdapter(app, configService));

  await app.listen(serverPort, async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
