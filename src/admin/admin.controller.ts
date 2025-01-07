import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../tokens/guards/jwt.guard'
import { AdminService } from './admin.service'
import { AdminGuard } from '../user/guards/admin.guard'
import { ConfirmGuard } from '../user/guards/confirm.guard'

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Patch('make/moderator')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async makeModerator(@Body('id') id: number) {
        return this.adminService.makeModerator(id)
    }

    @Patch('delete/moderator')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async removeModerator(@Body('id') id: number) {
        return this.adminService.removeModerator(id)
    }

    @Patch('make/admin')
    @UseGuards(JwtAuthGuard, AdminGuard, ConfirmGuard)
    async makeAdmin(@Body('id') id: number) {
        return this.adminService.makeAdmin(id)
    }

    @Patch('delete/admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async removeAdmin(@Body('id') id: number) {
        return this.adminService.removeAdmin(id)
    }
}
