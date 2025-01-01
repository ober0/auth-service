import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'

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
    async deleteUser(@Param('id') id: string) {
        const user = await this.userService.getUser(id)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return this.userService.deleteUser(id)
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers()
    }
}
