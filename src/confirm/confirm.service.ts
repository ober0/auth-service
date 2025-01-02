import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../redis/redis.service'
import { randomBytes, createHash } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import { TokensService } from '../tokens/tokens.service'
import { errors } from '../../config/errors'

@Injectable()
export class ConfirmService {
    private transporter: nodemailer.Transporter

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService,
        private readonly tokenService: TokensService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'yandex',
            auth: {
                user: configService.get<string>('SMTP_USER'),
                pass: configService.get<string>('SMTP_PASSWORD')
            }
        })
    }

    async generateHash(length: number = 16): Promise<string> {
        const randomData: string = randomBytes(32).toString('hex')
        const hash: string = createHash('sha256').update(randomData).digest('hex')
        return hash.substring(0, length)
    }

    async send(user: any) {
        if (user.confirmed) {
            throw new UnauthorizedException(errors.user.not_confirmed)
        }
        const email = user.email

        const code: number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USER'),
            to: email,
            subject: 'Код для подтверждения аккаунта',
            text: `Ваш код подтверждения: ${code}`
        }

        try {
            await this.transporter.sendMail(mailOptions)

            const hash = await this.generateHash(16)
            this.redisService.set(hash, email, 300)
            this.redisService.set(email, code, 300)

            return {
                success: true,
                hash
            }
        } catch (error) {
            throw new UnauthorizedException(errors.confirm.not_sent)
        }
    }

    async confirm(hash: string, code: number) {
        const email: string | number | null = await this.redisService.get(hash)
        if (!email || typeof email != 'string') {
            throw new UnauthorizedException(errors.confirm.code_expired_or_invalid)
        }
        const trueCode: string | number | null = await this.redisService.get(email)

        if (trueCode != code) {
            throw new UnauthorizedException(errors.confirm.invalid_code)
        }

        const user = await this.prisma.user.update({
            where: {
                email
            },
            data: {
                confirmed: true
            }
        })
        if (!user) {
            throw new UnauthorizedException(errors.user.not_found)
        }

        await this.redisService.delete(hash)
        await this.redisService.delete(email)

        return this.tokenService.generateTokens(user)
    }
}
