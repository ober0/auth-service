import { Injectable } from '@nestjs/common'
import { RedisService } from '../../redis/redis.service'
import { SessionDto, SessionsDto } from '../dto/sessions.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AdminSessionsService {
    constructor(
        private readonly redis: RedisService,
        private readonly jwtService: JwtService
    ) {}

    async logoutAll() {
        const keys = await this.redis.getKeys(`user:*:access_token:*`)
        const refreshKeys = await this.redis.getKeys(`user:*:refresh_token:*`)

        for (const key of keys) {
            await this.redis.delete(key)
        }

        for (const key of refreshKeys) {
            await this.redis.delete(key)
        }
    }

    async getSessions(id: string) {
        const key: string = `user:${id}:refresh_token:*:*`
        const userTokensRedis: string[] = await this.redis.getKeys(key)

        const sessions: SessionsDto = { sessions: [] }

        for (const tokenRedis of userTokensRedis) {
            const refreshTokenValue: string | number | null = await this.redis.get(tokenRedis)
            if (refreshTokenValue != 'active') {
                continue
            }
            const refreshToken: string = tokenRedis.split(':').pop()

            const decodeToken = this.jwtService.decode(refreshToken)
            if (!decodeToken) {
                await this.redis.delete(tokenRedis)
                continue
            }

            const id: string = decodeToken.jti
            const ip: string = decodeToken.ip
            const iat: number = decodeToken.iat

            const session: SessionDto = { id, ip, iat }

            sessions.sessions.push(session)
        }

        return sessions
    }

    async logoutByUserId(id: string) {
        const accessKey: string = `user:${id}:access_token:*:*`
        const refreshKey: string = `user:${id}:refresh_token:*:*`

        const accessKeysRedis: string[] = await this.redis.getKeys(accessKey)
        const refreshKeysRedis: string[] = await this.redis.getKeys(refreshKey)

        let closedSessions: number = 0

        for (const key of accessKeysRedis) {
            await this.redis.delete(key)
        }
        for (const key of refreshKeysRedis) {
            await this.redis.delete(key)
            closedSessions++
        }

        return {
            success: true,
            closed: closedSessions
        }
    }
}
