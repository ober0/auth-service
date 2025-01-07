import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { errors } from '../../config/errors'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'

@WebSocketGateway({
    namespace: '/api/socket/chat',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redis: RedisService
    ) {}

    async handleConnection(client: Socket) {
        const token = client.handshake.headers.authorization?.split(' ')[1]

        if (!token) {
            client.emit('message', errors.auth.not_authenticated)
            client.disconnect()
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            })

            client.data.user = payload
            const user_id = payload.id
            await this.redis.set(`user-${client.id}-ws`, user_id)

            console.log(`Авторизован пользователь: ${user_id}`)
        } catch (e) {
            console.log(e)
            client.emit('message', errors.auth.not_authenticated)
            client.disconnect()
        }
    }

    // Вызывается при отключении клиента
    async handleDisconnect(client: Socket) {
        await this.redis.delete(`user-${client.id}-ws`)
        console.log(`Клиент отключен: ${client.id}`)
    }

    // Обработчик сообщения от клиента
    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: { message: string }, @ConnectedSocket() client: Socket) {
        const client_id = await this.redis.get(`user-${client.id}-ws`)

        client.emit('message', { message: `Сообщение от клиента ${client_id} получено` })
    }
}
