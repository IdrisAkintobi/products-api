import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from './application/auth/auth.module';
import { ProductsModule } from './application/products/products.module';
import { UserModule } from './application/user/user.module';
import { Logger } from './utils/logger';
import { UtilModule } from './utils/util.module';

@Module({
    imports: [
        WinstonModule.forRoot(new Logger().getLoggerConfig(process.env.NODE_ENV)),
        MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/products'),
        ProductsModule,
        AuthModule,
        UserModule,
        UtilModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
