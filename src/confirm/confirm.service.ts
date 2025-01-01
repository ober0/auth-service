import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../redis/redis.service'
import { randomBytes, createHash } from 'crypto'

@Injectable()
export class ConfirmService {
    private transporter: nodemailer.Transporter

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
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
            throw new UnauthorizedException('You do have confirmed')
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
            throw new UnauthorizedException('Не удалось отправить письмо')
        }
    }
}
