import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class ConfirmService {
    send(user: any) {
        if (user.confirmed) {
            throw new UnauthorizedException('You do have confirmed')
        }
        const email = user.email

        return { email }
    }
}
