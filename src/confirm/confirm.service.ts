import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfirmService {
    private transporter: nodemailer.Transporter

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'yandex',
            auth: {
                user: configService.get<string>('SMTP_USER'),
                pass: configService.get<string>('SMTP_PASSWORD')
            }
        })
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
            return {
                success: true
            }
        } catch (error) {
            throw new UnauthorizedException('Не удалось отправить письмо')
        }
    }
}
