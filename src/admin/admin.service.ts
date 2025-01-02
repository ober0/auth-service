import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async makeAdmin(id: number) {
        const user = await this.userService.getUser(String(id))
        if (!user) {
            throw new BadRequestException('user is invalid')
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
}
