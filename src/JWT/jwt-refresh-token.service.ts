import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtRefreshTokenService {
    constructor(private readonly jwtService: JwtService) { }

    public name = "refresh"

    decode(token: string, options?: jwt.DecodeOptions): null | {
        [key: string]: any;
    } | string {
        return this.jwtService.decode(token, options)
    }

    verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
        return this.jwtService.verify(token, options)
    }

    verifyAsync<T extends object = any>(token: string, options?: JwtVerifyOptions): Promise<T> {
        return this.jwtService.verifyAsync(token, options)
    }

    signAsync(payload: any, options?: JwtSignOptions | Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string> {
        return this.jwtService.signAsync(payload, options)
    }

    sign(payload: any, options?: JwtSignOptions | Omit<JwtSignOptions, keyof jwt.SignOptions>): string {
        return this.jwtService.sign(payload, options)
    }
}