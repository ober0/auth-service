import { Module } from '@nestjs/common'
import { AdminSessionsModule } from './admin/admin-sessions.module'
import { UserSessionsModule } from './user/user-sessions.module'

@Module({
    imports: [AdminSessionsModule, UserSessionsModule],
    exports: [AdminSessionsModule, UserSessionsModule]
})
export class SessionsModule {}
