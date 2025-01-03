import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../tokens/guards/jsw.guard'
import { AdminGuard } from '../../user/guards/admin.guard'
import { AdminSessionsService } from './admin-sessions.service'
import { ModeratorGuard } from '../../user/guards/moderator.guard'

@Controller('sessions/admin')
export class AdminSessionsController {
    constructor(private readonly adminSessionService: AdminSessionsService) {}

    @Post('logout/all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, AdminGuard)
    async logoutAll() {
        await this.adminSessionService.logoutAll()
        return {
            success: true
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, ModeratorGuard)
    async getSessions(@Param('id') id: string) {
        return this.adminSessionService.getSessions(id)
    }

    @Post('logout/:id')
    @UseGuards(JwtAuthGuard, ModeratorGuard)
    async logoutByUserId(@Param('id') id: string) {
        return this.adminSessionService.logoutByUserId(id)
    }
}
