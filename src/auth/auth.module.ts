import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PasswordService } from '../password/password.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService, PasswordService, JwtStrategy, UserService],
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h'
                }
            })
        }),
        PassportModule,
        PrismaModule
    ]
})
export class AuthModule {}
