import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtAccessConfigService implements JwtOptionsFactory {

  constructor(protected configService: ConfigService<IconfigService>) { }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.getSecret(),
      signOptions: { expiresIn: this.getExpirationTime() },
    };
  }

  getSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  getExpirationTime(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')
  }
}
