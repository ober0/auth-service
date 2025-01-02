import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../tokens/guards/jsw.guard'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('make-admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async makeAdmin(@Body('id') id: number) {
        return this.adminService.makeAdmin(id)
    }
}
