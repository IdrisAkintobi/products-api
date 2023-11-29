import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import 'dotenv/config';
import { AppModule } from './app.module';
import { setupOpenApi } from './swagger.open.api';

const port = process.env.PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new FastifyAdapter({
            ignoreTrailingSlash: true,
        }),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));
    setupOpenApi(app);

    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server is running on: ${await app.getUrl()}`);
}
bootstrap();
