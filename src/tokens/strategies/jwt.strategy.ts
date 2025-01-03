import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../../redis/redis.service'
import { errors } from '../../../config/errors'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly redis: RedisService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        })
    }

    async validate(payload: any) {
        const access_key = `user:${payload.id}:access_token:${payload.jti}`

        const accessTokenStatus = await this.redis.get(access_key)

        if (accessTokenStatus === 'revoked' || accessTokenStatus === null) {
            throw new UnauthorizedException(errors.jwt.revoked)
        }

        return { id: payload.id, email: payload.email, status: payload.status, confirmed: payload.confirmed, jti: payload.jti }
    }
}
