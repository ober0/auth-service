import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'Content-Type, Authorization'
    })

    const config = new DocumentBuilder()
        .setTitle('My API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('auth') // Добавь нужные теги для твоего API
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document) // Устанавливаем Swagger по пути /api

    app.setGlobalPrefix('api')
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
