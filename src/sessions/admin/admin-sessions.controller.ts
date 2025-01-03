import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../tokens/guards/jsw.guard'
import { AdminGuard } from '../../user/guards/admin.guard'
import { AdminSessionsService } from './admin-sessions.service'

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
}
