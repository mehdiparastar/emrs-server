import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from './exceptions/all-exceptions.filter';
import { AppDataSource } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

const nodeENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${nodeENV}.env`,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    AppService,
  ],
})
export class AppModule { }
