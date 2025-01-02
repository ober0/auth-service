import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../tokens/guards/jsw.guard'
import { AdminService } from './admin.service'
import { AdminGuard } from '../user/guards/admin.guard'

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('make')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async makeAdmin(@Body('id') id: number) {
        return this.adminService.makeAdmin(id)
    }

    @Post('remove')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async removeAdmin(@Body('id') id: number) {
        return this.adminService.removeAdmin(id)
    }
}
