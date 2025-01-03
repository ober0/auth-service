import { Module } from '@nestjs/common'
import { AdminSessionsService } from './admin-sessions.service'
import { AdminSessionsController } from './admin-sessions.controller'
import { RedisService } from '../../redis/redis.service'

@Module({
    providers: [AdminSessionsService, RedisService],
    controllers: [AdminSessionsController],
    exports: [AdminSessionsService]
})
export class AdminSessionsModule {}
