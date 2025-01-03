import { Module } from '@nestjs/common'
import { AdminSessionsService } from './admin-sessions.service'
import { AdminSessionsController } from './admin-sessions.controller'
import { RedisService } from '../../redis/redis.service'
import { JwtService } from '@nestjs/jwt'

@Module({
    providers: [AdminSessionsService, RedisService, JwtService],
    controllers: [AdminSessionsController],
    exports: [AdminSessionsService]
})
export class AdminSessionsModule {}
