import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user = request.user
        const id = Number(request.params.id)

        if (!user) {
            throw new UnauthorizedException('User not authenticated')
        }

        if (user.id === id || user.isAdmin) {
            return true
        }

        throw new ForbiddenException('Access denied')
    }
}
