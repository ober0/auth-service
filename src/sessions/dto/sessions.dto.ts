export class SessionDto {
    id: string
    ip: string
    iat: number
}

export class SessionsDto {
    sessions: SessionDto[]
}
