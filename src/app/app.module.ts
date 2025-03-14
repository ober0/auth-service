import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { PasswordModule } from '../password/password.module'
import { TokensModule } from '../tokens/tokens.module'
import { AdminModule } from '../admin/admin.module'
import { SessionsModule } from '../sessions/sessions.module'
import { ChatModule } from '../chat/chat.module'

@Module({
    imports: [AuthModule, PrismaModule, UserModule, PasswordModule, TokensModule, AdminModule, SessionsModule, ChatModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
