import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from './user.service'
import { PasswordService } from '../password/password.service'
import { TokensService } from '../tokens/tokens.service'
import { TokensModule } from '../tokens/tokens.module'
import { ConfirmService } from '../confirm/confirm.service'
import { RedisModule } from '../redis/redis.module'

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, PasswordService, TokensService, ConfirmService],
    imports: [TokensModule, RedisModule]
})
export class UserModule {}
