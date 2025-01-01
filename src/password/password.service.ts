import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordService {
    async hash(password: string) {
        const salt = await bcrypt.genSalt()
        return bcrypt.hash(password, salt)
    }

    async compare(password: string, passwordHash: any) {
        return bcrypt.compare(password, passwordHash)
    }
}
