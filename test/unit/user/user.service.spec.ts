import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/application/user/user.service';
import { UserRepository } from '../../../src/db/repository/user.repository';
import { AuthGuard } from '../../../src/guards/auth.guard';
import { UserBuilder } from '../../builders/user.builder';
import { mockConfigService } from '../../mocks/configuration.service.mock';
import { mockUserRepository } from '../../mocks/user.repository.mock';

describe('UserService', () => {
    let userService: UserService;
    const mockUser = new UserBuilder().build();
    const userDocument = new UserBuilder();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: 'ConfigurationService', useValue: mockConfigService() },
            ],
        })
            .overrideProvider(UserRepository)
            .useValue(mockUserRepository)
            .overrideProvider('ConfigurationService')
            .useValue(mockConfigService())
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('UserService', () => {
        describe('update', () => {
            it('should update a user and return the updated user', async () => {
                mockUserRepository.updateUser.mockResolvedValue(userDocument);
                const result = await userService.update('1', mockUser);

                expect(mockUserRepository.updateUser).toHaveBeenCalledWith('1', mockUser);
                expect(result).toEqual(mockUser);
            });

            it('should throw an error when the user is not found', async () => {
                mockUserRepository.updateUser.mockResolvedValueOnce(null);
                await expect(userService.update('1', {})).rejects.toThrow('User not found');
            });
        });

        describe('delete', () => {
            it('should delete a user', async () => {
                mockUserRepository.deleteUser.mockResolvedValue(mockUser);
                await userService.delete(mockUser.id);
                expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(mockUser.id);
            });

            it('should throw an error when the user is not found', async () => {
                mockUserRepository.deleteUser.mockResolvedValueOnce(null);

                await expect(userService.delete(mockUser.id)).rejects.toThrow('User not found');
            });
        });
    });
});
