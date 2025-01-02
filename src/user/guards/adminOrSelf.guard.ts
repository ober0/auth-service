import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { errors } from '../../../config/errors'

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user = request.user
        const id = Number(request.params.id)

        if (!user) {
            throw new UnauthorizedException(errors.auth.not_authenticated)
        }

        if (user.id === id || user.isAdmin) {
            return true
        }

        throw new ForbiddenException(errors.auth.access_denied)
    }
}
