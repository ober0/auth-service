import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { PasswordService } from '../password/password.service'
import { TokensService } from '../tokens/tokens.service'
import { errors } from '../../config/errors'
import { GenTokenDto } from '../tokens/dto/genToken.dto'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly tokensService: TokensService
    ) {}

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        })
    }

    async addUser(userdata: UserDto, ip: string) {
        const oldUser = await this.findUserByEmail(userdata.email)
        if (oldUser) {
            throw new BadRequestException(errors.user.already_exists)
        }

        const passwordHash = await this.passwordService.hash(userdata.password)

        const user = await this.prisma.user.create({
            data: {
                email: userdata.email,
                passwordHash,
                name: userdata.name
            }
        })

        return this.tokensService.generateTokens({ ...user, ip })
    }

    async getUser(id: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: +id
            }
        })
        if (!user) {
            throw new NotFoundException(errors.user.not_found)
        }
        return user
    }

    async deleteUser(id: string, userJWT: GenTokenDto) {
        const user = await this.getUser(id)
        if (!user) {
            throw new NotFoundException(errors.user.not_found)
        }
        if (userJWT.status <= user.status) {
            throw new UnauthorizedException(errors.auth.access_denied)
        }
        return this.prisma.user.delete({
            where: {
                id: +id
            }
        })
    }

    async getAllUsers() {
        return this.prisma.user.findMany()
    }
}
