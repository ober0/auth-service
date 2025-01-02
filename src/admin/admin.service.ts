import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { TokensService } from '../tokens/tokens.service'
import { errors } from '../../config/errors'

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly tokenService: TokensService
    ) {}

    async makeAdmin(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException(errors.user.not_found)
        }

        return this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                isAdmin: true
            }
        })
    }

    async removeAdmin(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException(errors.user.not_found)
        }

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                isAdmin: false
            }
        })
    }
}
