import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtAccessModule } from "@nestjs/jwt";
import { JwtAccessConfigService } from "./jwt-access-config.service";
import { JwtAccessTokenService } from "./jwt-access-token.service";

@Module({
    imports: [
        NestJwtAccessModule.registerAsync({
            useClass: JwtAccessConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [JwtAccessTokenService],
    exports: [NestJwtAccessModule, JwtAccessTokenService]
})

export class JwtAccessModule { }