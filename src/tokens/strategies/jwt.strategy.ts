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
        const access_key = `user:${payload.id}:access_token:${payload.jti}:*`

        const accessTokens = await this.redis.getKeys(access_key)

        const status = await this.redis.get(accessTokens[0])

        if (status != 'active') {
            throw new UnauthorizedException(errors.jwt.revoked)
        }

        return { id: payload.id, email: payload.email, status: payload.status, confirmed: payload.confirmed, jti: payload.jti }
    }
}
