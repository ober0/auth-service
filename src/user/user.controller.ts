import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, Request, ValidationPipe, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../tokens/guards/jsw.guard'
import { AdminGuard } from './guards/admin.guard'
import { ConfirmGuard } from './guards/confirm.guard'
import { ConfirmService } from '../confirm/confirm.service'

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly confirmService: ConfirmService
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('add')
    async addUser(@Body() userdata: UserDto) {
        return this.userService.addUser(userdata)
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUser(id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard, ConfirmGuard)
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id)
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers()
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm')
    async confirm(@Request() request: any) {
        return this.confirmService.send(request.user)
    }
}
