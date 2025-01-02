import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from '../redis/redis.service'
import { RedisModule } from '../redis/redis.module'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [ConfigService, RedisService, PrismaService]
})
export class ConfirmModule {}
