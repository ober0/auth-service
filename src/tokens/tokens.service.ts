import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GenTokenDto } from './dto/genToken.dto'

@Injectable()
export class TokensService {
    constructor(private readonly jwtService: JwtService) {}

    async generateTokens(user: any) {
        const payload: GenTokenDto = {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            confirmed: user.confirmed
        }

        const access_token = this.jwtService.sign(payload, { expiresIn: '5m' })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' })

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken)
            const newTokens = await this.generateTokens({ id: payload.id, email: payload.email, isAdmin: payload.isAdmin, confirmed: payload.confirmed })
            return newTokens
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}
