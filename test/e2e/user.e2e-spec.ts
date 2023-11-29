import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserController } from '../../src/application/user/user.controller';
import { UserService } from '../../src/application/user/user.service';
import { AuthGuard } from '../../src/guards/auth.guard';
import { mockConfigService } from '../mocks/configuration.service.mock';
import { mockLogger } from '../mocks/logger.mock';
import { mockUserService } from '../mocks/user.service.mock';

describe('AppController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
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

        app = testingModule.createNestApplication(new FastifyAdapter());
        app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/v1/user} (PUT DELETE)', () => {
        const url = '/v1/user/update';
        it('Should throw if request body is malformed', async () => {
            const response = await app.inject({
                url,
                method: 'PUT',
                payload: {
                    email: '',
                    firstName: 'firstName',
                },
            });
            expect(response.json()).toStrictEqual({
                success: false,
                errors: [{ errorCode: '400', errorMessage: 'email must be an email' }],
            });
            expect(response.statusCode).toEqual(400);
        });

        it('Should successfully update user', async () => {
            const payload = {
                email: 'example@mail.com',
                lastName: 'lastName',
            };
            const response = await app.inject({
                url,
                method: 'PUT',
                payload,
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(200);
            expect(mockUserService.update).toHaveBeenCalled();
            expect(mockUserService.update).toHaveBeenCalledWith(undefined, payload);
        });

        it('Should successfully delete user', async () => {
            const url = '/v1/user/delete';
            const response = await app.inject({
                url,
                method: 'DELETE',
            });
            expect(response.statusCode).toEqual(204);
            expect(mockUserService.delete).toHaveBeenCalled();
        });
    });
});
