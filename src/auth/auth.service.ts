import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { PasswordService } from '../password/password.service'
import { LoginData } from './dto/auth.dto'
import { TokensService } from '../tokens/tokens.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly tokensService: TokensService
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

    async login(login_data: LoginData) {
        const user = await this.validateUser(login_data)
        return this.tokensService.generateTokens(user)
    }
}
