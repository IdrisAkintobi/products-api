import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthController } from '../../../src/application/auth/auth.controller';
import { AuthService } from '../../../src/application/auth/auth.service';
import { UserBuilder } from '../../builders/user.builder';
import { mockAuthService } from '../../mocks/auth.service.mock';
import { mockLogger } from '../../mocks/logger.mock';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const userData = new UserBuilder().build();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should login a user', async () => {
        const { email, password } = userData;
        mockAuthService.login.mockResolvedValue('testToken');

        const result = await authController.login({ email, password });

        expect(authService.login).toHaveBeenCalledWith({ email, password });
        expect(result).toEqual('testToken');
    });

    it('should register a user', async () => {
        mockAuthService.register.mockResolvedValue('testToken');

        const result = await authController.register(userData);

        expect(authService.register).toHaveBeenCalledWith(userData);
        expect(result).toEqual('testToken');
    });
});
