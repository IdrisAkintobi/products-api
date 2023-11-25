import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthService } from '../../../src/application/auth/auth.service';
import { UserRepository } from '../../../src/db/repository/user.repository';
import { UserBuilder } from '../../builders/user.builder';
import { mockJwtService } from '../../mocks/jwt.service.mock';
import { mockLogger } from '../../mocks/logger.mock';
import { mockUserRepository } from '../../mocks/user.repository.mock';

jest.mock('argon2', () => ({
    hash: jest.fn(),
    verify: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
    let authService: AuthService;
    const userData = new UserBuilder().build();
    const userDocument = new UserBuilder();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserRepository,
                JwtService,
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .overrideProvider(UserRepository)
            .useValue(mockUserRepository)
            .overrideProvider(JwtService)
            .useValue(mockJwtService)
            .compile();

        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user', async () => {
        mockUserRepository.createUser.mockResolvedValue(userDocument);
        await authService.register(userData);

        expect(mockUserRepository.createUser).toHaveBeenCalledWith(userData);
        expect(mockLogger.info).toHaveBeenCalledWith(`New user account created`);
        expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: userData.id });
    });

    it('should login a user', async () => {
        const { email, password } = userData;

        mockUserRepository.findByEmail.mockResolvedValue(userDocument);
        mockJwtService.sign.mockReturnValue('token');

        const result = await authService.login({ email, password });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
        expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: userData.id });
        expect(result).toEqual({ access_token: 'token' });
    });
});
