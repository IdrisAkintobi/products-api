import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserRepository } from '../../db/repository/user.repository';
import { User } from '../../db/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async register(userData: RegisterDto) {
        const user = await this.userRepository.findByEmail(userData.email);
        if (user) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await this.hashPassword(userData.password);
        userData.password = hashedPassword;
        const newUser = await this.userRepository.createUser(userData as User);
        this.logger.info(`New user account created`);
        const token = await this.generateToken({ sub: newUser.toObject().id });
        return { accessToken: token };
    }

    async login(credentials: LoginDto) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isPasswordValid = await this.comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }
        const token = await this.generateToken({ sub: user.toObject().id });
        return { accessToken: token };
    }

    private async generateToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    private async hashPassword(password: string): Promise<string> {
        return argon.hash(password);
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return argon.verify(hashedPassword, password);
    }
}
