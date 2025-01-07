import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../tokens/guards/jwt.guard'
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

    @Post('logout/session/')
    @UseGuards(JwtAuthGuard)
    async logoutBySessionId(@Body('session_id') session_id: string, @Request() request: any) {
        const user_id: string = request.user.id
        return this.adminSessionService.logoutBySessionId(user_id, session_id)
    }
}
