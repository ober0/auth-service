import { Injectable } from '@nestjs/common'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class AdminSessionsService {
    constructor(private readonly redis: RedisService) {}

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
}
