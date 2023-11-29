import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthController } from '../../src/application/auth/auth.controller';
import { AuthService } from '../../src/application/auth/auth.service';
import { mockAuthService } from '../mocks/auth.service.mock';
import { mockLogger } from '../mocks/logger.mock';

describe('AppController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        app = testingModule.createNestApplication(new FastifyAdapter());
        app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/v1/auth} (POST)', () => {
        const url = '/v1/auth/login';
        it('Should throw if request body is malformed', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: {
                    email: '',
                    password: 'QWE123qwe!@#',
                },
            });
            expect(response.json()).toStrictEqual({
                success: false,
                errors: [{ errorCode: '400', errorMessage: 'email must be an email' }],
            });
            expect(response.statusCode).toEqual(400);
        });

        it('Should successfully login', async () => {
            const payload = {
                email: 'example@mail.com',
                password: 'QWE123qwe!@#',
            };
            const response = await app.inject({
                url,
                method: 'POST',
                payload,
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(200);
            expect(mockAuthService.login).toHaveBeenCalled();
            expect(mockAuthService.login).toHaveBeenCalledWith(payload);
        });

        it('Should successfully register', async () => {
            const payload = {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'example@mail.com',
                password: 'QWE123qwe!@#',
            };
            const response = await app.inject({
                url: '/v1/auth/register',
                method: 'POST',
                payload,
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(201);
            expect(mockAuthService.register).toHaveBeenCalled();
            expect(mockAuthService.register).toHaveBeenCalledWith(payload);
        });
    });
});
