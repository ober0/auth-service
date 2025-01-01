import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokensService {
    constructor(private readonly jwtService: JwtService) {}

    async generateTokens(payload: { email: string; isAdmin: boolean }) {
        const access_token = this.jwtService.sign(payload, { expiresIn: '1m' })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '14d' })

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken)
            const newTokens = await this.generateTokens({ email: payload.email, isAdmin: payload.isAdmin })
            return newTokens
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}
