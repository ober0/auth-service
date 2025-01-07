import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { errors } from '../../config/errors'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from '../redis/redis.service'

@WebSocketGateway({
    namespace: '/api/socket/chat',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private readonly jwtService: JwtService,
        private readonly redis: RedisService
    ) {}

    async handleConnection(client: Socket) {
        const token = client.handshake.headers.authorization?.split(' ')[1]

        if (!token) {
            client.emit('answer', errors.auth.not_authenticated)
            client.disconnect()
            return
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            })

            client.data.user = payload
            const user_id = payload.id
            await this.redis.set(`user-${user_id}-ws`, client.id)
        } catch (e) {
            client.emit('answer', errors.auth.not_authenticated)
            client.disconnect()
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.user?.id
        if (userId) {
            await this.redis.delete(`user-${userId}-ws`)
        }
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: { message: string; id: number }, @ConnectedSocket() client: Socket) {
        try {
            const selfId = client.data.user.id

            // Получение ID сокета целевого клиента
            const clientId = await this.redis.get(`user-${data.id}-ws`)
            if (!clientId) {
                client.emit('answer', { error: 'Пользователь не найден' })
                return
            }

            // Отправка сообщения целевому клиенту
            this.server.to(clientId.toString()).emit('answer', { message: data.message, from: selfId })
        } catch (error) {
            client.emit('answer', { error: 'Внутренняя ошибка сервера' })
        }
    }
}
