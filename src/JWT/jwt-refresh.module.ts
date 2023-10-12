import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtRefreshModule } from "@nestjs/jwt";
import { JwtRefreshConfigService } from "./jwt-refresh-config.service";
import { JwtRefreshTokenService } from "./jwt-refresh-token.service";

@Module({
    imports: [
        NestJwtRefreshModule.registerAsync({
            useClass: JwtRefreshConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [JwtRefreshTokenService],
    exports: [NestJwtRefreshModule, JwtRefreshTokenService]
})

export class JwtRefreshModule { }