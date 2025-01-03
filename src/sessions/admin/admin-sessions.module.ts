import { Module } from '@nestjs/common'
import { AdminSessionsService } from './admin-sessions.service'
import { AdminSessionsController } from './admin-sessions.controller'

@Module({
    providers: [AdminSessionsService],
    controllers: [AdminSessionsController],
    exports: [AdminSessionsService]
})
export class AdminSessionsModule {}
