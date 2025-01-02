import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { PasswordModule } from '../password/password.module'
import { TokensModule } from '../tokens/tokens.module'

@Module({
    providers: [AdminService, PrismaService, UserService],
    controllers: [AdminController],
    imports: [PasswordModule, TokensModule]
})
export class AdminModule {}
