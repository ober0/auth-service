import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from '../redis/redis.service'
import { RedisModule } from '../redis/redis.module'

@Module({
    imports: [RedisModule],
    providers: [ChatGateway, JwtService, RedisService],
    exports: [ChatGateway]
})
export class ChatModule {}
