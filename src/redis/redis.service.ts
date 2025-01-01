import { Inject, Injectable } from '@nestjs/common'
import * as Redis from 'ioredis'

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis) {}

    async set(key: string, value: string | number, ttl?: number): Promise<void> {
        try {
            if (ttl) {
                await this.redisClient.set(key, value, 'EX', ttl)
            } else {
                await this.redisClient.set(key, value)
            }
        } catch (error) {
            console.error('Ошибка при записи в Redis:', error)
        }
    }

    async get(key: string): Promise<string | number | null> {
        try {
            return await this.redisClient.get(key)
        } catch (error) {
            console.error('Ошибка при получении из Redis:', error)
            return null
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redisClient.del(key)
        } catch (error) {
            console.error('Ошибка при удалении из Redis:', error)
        }
    }
}
