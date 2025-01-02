import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokensService {
    constructor(private readonly jwtService: JwtService) {}

    async generateTokens(payload: { id: number; email: string; isAdmin: boolean; confirmed: boolean }) {
        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '14d' })

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
