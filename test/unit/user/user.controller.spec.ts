import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserController } from '../../../src/application/user/user.controller';
import { UserService } from '../../../src/application/user/user.service';
import { AuthGuard } from '../../../src/guards/auth.guard';
import { HttpResponseMapper } from '../../../src/utils/resources/http-response-mapper';
import { UserBuilder } from '../../builders/user.builder';
import { mockConfigService } from '../../mocks/configuration.service.mock';
import { mockLogger } from '../../mocks/logger.mock';
import { mockUserService } from '../../mocks/user.service.mock';

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;

    const mockUser = new UserBuilder().build();
    const mockUserUpdateData = new UserBuilder().buildUpdate();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: 'ConfigurationService', useValue: mockConfigService() },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .overrideProvider('ConfigurationService')
            .useValue(mockConfigService())
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update a user', async () => {
        mockUserService.update.mockResolvedValue(new UserBuilder().build());
        const result = await controller.update(mockUser.id, mockUserUpdateData);

        expect(userService.update).toHaveBeenCalledWith(mockUser.id, mockUserUpdateData);
        expect(result).toEqual(HttpResponseMapper.map(mockUser));
    });

    it('should delete a user', async () => {
        await controller.delete(mockUser.id);

        expect(userService.delete).toHaveBeenCalledWith(mockUser.id);
    });
});
