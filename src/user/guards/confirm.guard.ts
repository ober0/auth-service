import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class ConfirmGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        if (!user) {
            throw new UnauthorizedException('User not authenticated')
        }

        if (!user.confirmed) {
            throw new UnauthorizedException('You do not have confirmed account')
        }

        return true
    }
}
