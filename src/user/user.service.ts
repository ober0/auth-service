import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { PasswordService } from '../password/password.service'
import { TokensService } from '../tokens/tokens.service'

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

    async addUser(userdata: UserDto) {
        const oldUser = await this.findUserByEmail(userdata.email)
        if (oldUser) {
            throw new BadRequestException('User already exists')
        }

        const passwordHash = await this.passwordService.hash(userdata.password)

        const user = await this.prisma.user.create({
            data: {
                email: userdata.email,
                passwordHash,
                name: userdata.name
            }
        })

        const payload = {
            email: user.email,
            isAdmin: user.isAdmin,
            confirmed: user.confirmed
        }

        return this.tokensService.generateTokens(payload)
    }

    async getUser(id: string) {
        return this.prisma.user.findFirst({
            where: {
                id: +id
            }
        })
    }

    async deleteUser(id: string) {
        const user = await this.getUser(id)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
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
