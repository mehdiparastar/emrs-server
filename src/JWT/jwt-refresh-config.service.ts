import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshConfigService implements JwtOptionsFactory {

    constructor(protected configService: ConfigService<IconfigService>) { }

    createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.getSecret(),
            signOptions: { expiresIn: this.getExpirationTime() },
        };
    }

    getSecret(): string {
        return this.configService.get<string>('JWT_REFRESH_SECRET');;
    }

    getExpirationTime(): string {
        return this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')
    }
}
