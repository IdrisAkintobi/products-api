import { Module } from '@nestjs/common';
import { DBModule } from '../../db/db.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [DBModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [],
})
export class UserModule {}
