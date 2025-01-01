import { BadRequestException, Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { PasswordService } from '../password/password.service'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService
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

        return this.prisma.user.create({
            data: {
                email: userdata.email,
                passwordHash,
                name: userdata.name
            }
        })
    }

    async getUser(id: string) {
        return this.prisma.user.findFirst({
            where: {
                id: +id
            }
        })
    }

    async deleteUser(id: string) {
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
