import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, Request, ValidationPipe, HttpStatus, HttpCode, Patch, ForbiddenException } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../tokens/guards/jsw.guard'
import { ConfirmGuard } from './guards/confirm.guard'
import { ConfirmService } from '../confirm/confirm.service'
import { ModeratorOrSelfGuard } from './guards/moderatorOrSelf.guard'

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
    @UseGuards(JwtAuthGuard, ModeratorOrSelfGuard)
    async deleteUser(@Param('id') id: string, @Request() request: any) {
        return this.userService.deleteUser(id, request.user)
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

    @UseGuards(JwtAuthGuard)
    @Patch('confirm')
    @HttpCode(HttpStatus.OK)
    async checkConfirm(@Body() { hash, code }: { hash: string; code: number }) {
        return this.confirmService.confirm(hash, code)
    }
}
