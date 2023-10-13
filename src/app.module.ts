import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { DatabaseModule } from './database.module';
import { AllExceptionFilter } from './exceptions/all-exceptions.filter';
import { UsersModule } from './users/users.module';
import { JwtAccessModule } from './JWT/jwt-access.module';
import { JwtRefreshModule } from './JWT/jwt-refresh.module';
import { FilesModule } from './Files/files.module';

const nodeENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${nodeENV}.env`,
    }),
    DatabaseModule,
    JwtAccessModule,
    JwtRefreshModule,
    UsersModule,
    AuthModule,
    FilesModule
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

