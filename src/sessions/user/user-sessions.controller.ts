import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../tokens/guards/jsw.guard'
import { AdminSessionsService } from '../admin/admin-sessions.service'
import { UserSessionsService } from './user-sessions.service'

@Controller('sessions/user')
export class UserSessionsController {
    constructor(
        private readonly adminSessionService: AdminSessionsService,
        private readonly userSessionService: UserSessionsService
    ) {}

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getSessions(@Request() request: any) {
        const id = request.user.id
        return this.adminSessionService.getSessions(id)
    }
}
