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

    async makeModerator(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException(errors.user.not_found)
        }

        return this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                status: 2
            }
        })
    }

    async removeModerator(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException(errors.user.not_found)
        }

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                status: 1
            }
        })
    }

    async makeAdmin(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException(errors.user.not_found)
        }

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                status: 3
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
                status: 1
            }
        })
    }
}
