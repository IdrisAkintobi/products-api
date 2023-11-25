import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DBModule } from '../../db/db.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        DBModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule {}
