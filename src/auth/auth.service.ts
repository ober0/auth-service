import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { PasswordService } from '../password/password.service'
import { LoginData } from './dto/auth.dto'
import { TokensService } from '../tokens/tokens.service'
import { errors } from '../../config/errors'
import { RedisService } from '../redis/redis.service'
import { config } from '../../config/consts'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly tokensService: TokensService,
        private readonly redisService: RedisService
    ) {}

    async validateUser(loginData: LoginData, ip: string) {
        const user = await this.userService.findUserByEmail(loginData.email)
        if (!user) {
            throw new UnauthorizedException(errors.user.not_found)
        }

        const isCorrectPassword = await this.passwordService.compare(loginData.password, user.passwordHash)
        if (!isCorrectPassword) {
            await this.redisService.incrementWithTTL(`login-${ip}`, 1, config.auth.many_attempts_ban)

            throw new UnauthorizedException(errors.user.wrong_credentials)
        }

        return user
    }

    async login(login_data: LoginData, ip: string) {
        const loginAttempts: string | number = await this.redisService.get(`login-${ip}`)

        if (+loginAttempts >= config.auth.attempts_limit) {
            throw new UnauthorizedException(errors.auth.many_attempts)
        }

        const user = await this.validateUser(login_data, ip)
        return this.tokensService.generateTokens(user)
    }
}
