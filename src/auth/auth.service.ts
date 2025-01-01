import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { PasswordService } from '../password/password.service'
import { JwtService } from '@nestjs/jwt'
import { LoginData } from './dto/auth.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService
    ) {}

    async validateUser(loginData: LoginData) {
        const user = await this.userService.findUserByEmail(loginData.email)
        if (!user) {
            throw new UnauthorizedException('User does not exist')
        }

        const isCorrectPassword = await this.passwordService.compare(loginData.password, user.passwordHash)
        if (!isCorrectPassword) {
            throw new UnauthorizedException('Wrong Password or Email')
        }

        return user
    }

    async generateTokens(payload: { email: string; isAdmin: boolean }) {
        const access_token = this.jwtService.sign(payload, { expiresIn: '1m' })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '14d' })

        return { access_token, refresh_token }
    }

    async login(login_data: LoginData) {
        const user = await this.validateUser(login_data)

        const payload = {
            email: login_data.email,
            isAdmin: user.isAdmin
        }

        return this.generateTokens(payload)
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
