import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GenTokenDto } from './dto/genToken.dto'
import { errors } from '../../config/errors'
import { config } from '../../config/consts'

@Injectable()
export class TokensService {
    constructor(private readonly jwtService: JwtService) {}

    async generateTokens(user: any) {
        const payload: GenTokenDto = {
            id: user.id,
            email: user.email,
            status: user.status,
            confirmed: user.confirmed
        }

        const access_token = this.jwtService.sign(payload, { expiresIn: config.jwt.access_tokenExpiresIn })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: config.jwt.refresh_tokenExpiresIn })

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken)
            const newTokens = await this.generateTokens({ id: payload.id, email: payload.email, status: payload.status, confirmed: payload.confirmed })
            return newTokens
        } catch (error) {
            throw new UnauthorizedException(errors.auth.invalid_refresh_token)
        }
    }
}
