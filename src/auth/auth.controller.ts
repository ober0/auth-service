import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginData } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async login(@Body() userdata: LoginData) {
        return this.authService.login(userdata)
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken)
    }
}
