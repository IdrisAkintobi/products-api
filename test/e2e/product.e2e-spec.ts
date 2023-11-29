import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProductController } from '../../src/application/products/product.controller';
import { ProductService } from '../../src/application/products/product.service';
import { AuthGuard } from '../../src/guards/auth.guard';
import { mockLogger } from '../mocks/logger.mock';
import { mockProductService } from '../mocks/product.service.mock';

describe('AppController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: mockProductService,
                },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideProvider(ProductService)
            .useValue(mockProductService)
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .compile();

        app = testingModule.createNestApplication(new FastifyAdapter());
        app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/v1/products/create (POST GET PUT DELETE)', () => {
        const payload = {
            name: 'Product name',
            description: 'Product description',
            price: 1000,
            model: 'Product model',
            brand: 'Product brand',
            category: 'Wrong category',
            quantity: 819,
            image: 'https://example.com/image.png',
        };

        it('Should throw if request body is malformed', async () => {
            const url = '/v1/products/create';
            const response = await app.inject({
                url,
                method: 'POST',
                payload,
            });
            expect(response.json()).toStrictEqual({
                success: false,
                errors: [
                    {
                        errorCode: '400',
                        errorMessage:
                            'category must be one of the following values: Other, Electronics, Clothing, Furniture, Appliances',
                    },
                ],
            });
            expect(response.statusCode).toEqual(400);
        });

        it('Should successfully create product', async () => {
            const url = '/v1/products/create';
            const response = await app.inject({
                url,
                method: 'POST',
                payload: {
                    ...payload,
                    category: 'Electronics',
                },
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(201);
            expect(mockProductService.create).toHaveBeenCalled();
            expect(mockProductService.create).toHaveBeenCalledWith({
                ...payload,
                category: 'Electronics',
            });
        });

        it('Should successfully get products', async () => {
            const url = '/v1/products/all?page=2&limit=10';
            const response = await app.inject({
                url,
                method: 'GET',
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(200);
            expect(mockProductService.findAll).toHaveBeenCalled();
        });

        it('Should successfully get product', async () => {
            const url = '/v1/products/product/656602e028356a1ed78d3943';
            const response = await app.inject({
                url,
                method: 'GET',
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(200);
            expect(mockProductService.findById).toHaveBeenCalled();
            expect(mockProductService.findById).toHaveBeenCalledWith('656602e028356a1ed78d3943');
        });

        it('Should successfully update product', async () => {
            const url = '/v1/products/update/656602e028356a1ed78d3943';
            const response = await app.inject({
                url,
                method: 'PUT',
                payload,
            });
            expect(response.json()).toStrictEqual({
                success: true,
            });
            expect(response.statusCode).toEqual(200);
            expect(mockProductService.update).toHaveBeenCalled();
            expect(mockProductService.update).toHaveBeenCalledWith(
                '656602e028356a1ed78d3943',
                payload,
            );
        });

        it('Should successfully delete product', async () => {
            const url = '/v1/products/delete/656602e028356a1ed78d3943';
            const response = await app.inject({
                url,
                method: 'DELETE',
            });
            expect(response.statusCode).toEqual(204);
            expect(mockProductService.delete).toHaveBeenCalled();
            expect(mockProductService.delete).toHaveBeenCalledWith('656602e028356a1ed78d3943');
        });
    });
});
