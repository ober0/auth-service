import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { errors } from '../../../config/errors'

@Injectable()
export class ConfirmGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        if (!user) {
            throw new UnauthorizedException(errors.auth.not_authenticated)
        }

        if (!user.confirmed) {
            throw new UnauthorizedException(errors.user.not_confirmed)
        }

        return true
    }
}
