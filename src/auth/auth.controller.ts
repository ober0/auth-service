import { Body, Controller, Post, UsePipes, Request, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginData } from './dto/auth.dto'
import { TokensService } from '../tokens/tokens.service'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokensService: TokensService
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async login(@Body() userdata: LoginData, @Request() req) {
        return this.authService.login(userdata, req.ip)
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        return this.tokensService.refreshTokens(refreshToken)
    }
}
