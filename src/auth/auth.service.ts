import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { PasswordService } from '../password/password.service'
import { LoginData } from './dto/auth.dto'
import { TokensService } from '../tokens/tokens.service'
import { errors } from '../../config/errors'

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
            throw new UnauthorizedException(errors.user.not_found)
        }

        const isCorrectPassword = await this.passwordService.compare(loginData.password, user.passwordHash)
        if (!isCorrectPassword) {
            throw new UnauthorizedException(errors.user.wrong_credentials)
        }

        return user
    }

    async login(login_data: LoginData) {
        const user = await this.validateUser(login_data)
        return this.tokensService.generateTokens(user)
    }
}
