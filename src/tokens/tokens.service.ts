import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GenTokenDto } from './dto/genToken.dto'
import { errors } from '../../config/errors'
import { config } from '../../config/consts'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redis: RedisService
    ) {}

    generateUniqueTokenId(id: number): string {
        return 'token-' + Math.random().toString(36).substr(2, 9) + '-' + id.toString()
    }

    async generateTokens(user: any) {
        const payload: GenTokenDto = {
            id: user.id,
            email: user.email,
            status: user.status,
            confirmed: user.confirmed,
            jti: this.generateUniqueTokenId(user.id),
            ip: user.ip
        }

        const access_token = this.jwtService.sign(payload, { expiresIn: `${config.jwt.access_tokenExpiresIn}s` })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: `${config.jwt.refresh_tokenExpiresIn}s` })

        const access_key = `user:${user.id}:access_token:${payload.jti}:${access_token}`
        const refresh_key = `user:${user.id}:refresh_token:${payload.jti}:${refresh_token}`

        await this.redis.set(access_key, 'active', Number(config.jwt.access_tokenExpiresIn))
        await this.redis.set(refresh_key, 'active', Number(config.jwt.refresh_tokenExpiresIn))

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken)

            const key: string = `user:${payload.id}:refresh_token:${payload.jti}:*`
            const status_keys = await this.redis.getKeys(key)

            const status = await this.redis.get(status_keys[0])

            if (status != 'active') {
                throw new UnauthorizedException(errors.jwt.revoked)
            }

            await this.redis.delete(status_keys[0])

            const newTokens = await this.generateTokens({ id: payload.id, email: payload.email, status: payload.status, confirmed: payload.confirmed, jti: payload.jti, ip: payload.ip })
            return newTokens
        } catch (error) {
            throw new UnauthorizedException(errors.auth.invalid_refresh_token)
        }
    }
}
