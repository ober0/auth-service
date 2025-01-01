import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from '../redis/redis.service'
import { RedisModule } from '../redis/redis.module'

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [ConfigService, RedisService]
})
export class ConfirmModule {}
