import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../tokens/guards/jsw.guard'
import { AdminSessionsService } from '../admin/admin-sessions.service'
import { UserSessionsService } from './user-sessions.service'
import { ModeratorGuard } from '../../user/guards/moderator.guard'

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

    @Post('logout/')
    @UseGuards(JwtAuthGuard)
    async logoutByUserId(@Request() request: any) {
        const id = request.user.id
        return this.adminSessionService.logoutByUserId(id)
    }
}
