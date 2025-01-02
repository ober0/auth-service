import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { errors } from '../../../config/errors'

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        if (!user) {
            throw new UnauthorizedException(errors.auth.not_authenticated)
        }

        if (!user.isAdmin) {
            throw new UnauthorizedException(errors.auth.no_admin_permissions)
        }

        return true
    }
}
