import { Module } from '@nestjs/common';
import { JwtAccessModule } from 'src/JWT/jwt-access.module';
import { JwtRefreshModule } from 'src/JWT/jwt-refresh.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { GoogleOauthStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    UsersModule,
    JwtAccessModule,
    JwtRefreshModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleOauthStrategy,
  ],
  exports: [AccessTokenStrategy],
})
export class AuthModule { }
