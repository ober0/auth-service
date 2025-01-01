import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { PasswordModule } from '../password/password.module'

@Module({
    imports: [AuthModule, PrismaModule, UserModule, PasswordModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
