import { Module } from '@nestjs/common'
import { UserSessionsController } from './user-sessions.controller'
import { UserSessionsService } from './user-sessions.service'

@Module({
    controllers: [UserSessionsController],
    providers: [UserSessionsService],
    exports: [UserSessionsService]
})
export class UserSessionsModule {}
