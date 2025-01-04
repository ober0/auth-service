import { Module } from '@nestjs/common'
import { UserSessionsController } from './user-sessions.controller'
import { UserSessionsService } from './user-sessions.service'
import { RedisService } from '../../redis/redis.service'
import { JwtService } from '@nestjs/jwt'
import { AdminSessionsService } from '../admin/admin-sessions.service'

@Module({
    controllers: [UserSessionsController],
    providers: [UserSessionsService, RedisService, JwtService, AdminSessionsService],
    exports: [UserSessionsService]
})
export class UserSessionsModule {}
