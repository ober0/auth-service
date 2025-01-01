import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginData {
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}
