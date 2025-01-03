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

    async incrementWithTTL(key: string, incrementBy: number = 1, ttl?: number): Promise<number> {
        try {
            const newValue = await this.redisClient.incrby(key, incrementBy)

            if (ttl) {
                await this.redisClient.expire(key, ttl)
            }

            return newValue
        } catch (error) {
            console.error('Ошибка при увеличении значения с TTL в Redis:', error)
            throw error
        }
    }

    async getKeys(pattern: string): Promise<string[]> {
        try {
            let cursor = '0'
            const keys: string[] = []

            do {
                const result = await this.redisClient.scan(cursor, 'MATCH', pattern)
                cursor = result[0]
                keys.push(...result[1])
            } while (cursor !== '0')

            return keys
        } catch (error) {
            console.error('Ошибка при получении ключей из Redis:', error)
            return []
        }
    }
}
