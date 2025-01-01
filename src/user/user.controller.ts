import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, Request, ValidationPipe, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../auth/guards/jsw.guard'
import { AdminGuard } from '../auth/guards/admin.guard'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id)
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers()
    }
}
