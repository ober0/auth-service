import { Body, Controller, Post, UsePipes, Request, ValidationPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginData } from './dto/auth.dto'
import { TokensService } from '../tokens/tokens.service'
import { AdminGuard } from '../user/guards/admin.guard'
import { JwtAuthGuard } from '../tokens/guards/jsw.guard'

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
