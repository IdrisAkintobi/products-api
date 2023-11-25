import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupOpenApi = app => {
    const options = new DocumentBuilder()
        .setTitle('Products API')
        .setDescription('Products API description')
        .setVersion('1.0')
        .addTag('user')
        .addTag('product')
        .addBearerAuth()
        .addServer('http://localhost:3000', 'Local server')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
};
