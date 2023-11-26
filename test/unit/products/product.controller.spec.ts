import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProductController } from '../../../src/application/products/product.controller';
import { ProductService } from '../../../src/application/products/product.service';
import { AuthGuard } from '../../../src/guards/auth.guard';
import { HttpResponseMapper } from '../../../src/resources/http-response-mapper';
import { ProductBuilder } from '../../builders/product.builder';
import { mockLogger } from '../../mocks/logger.mock';
import { mockProductService } from '../../mocks/product.service.mock';

describe('ProductController', () => {
    let controller: ProductController;
    let productService: ProductService;
    const mockProduct = new ProductBuilder().build();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        controller = module.get<ProductController>(ProductController);
        productService = module.get<ProductService>(ProductService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should call service.findById with correct parameters and return the result', async () => {
        mockProductService.findById.mockResolvedValue(mockProduct);
        const expected = await controller.findById(mockProduct.id);
        expect(productService.findById).toHaveBeenCalledWith(mockProduct.id);
        expect(productService.findById).toHaveBeenCalledTimes(1);
        expect(expected).toEqual(HttpResponseMapper.map(mockProduct));
    });

    it('should call productService.update with correct parameters and return the result', async () => {
        mockProductService.update.mockResolvedValue(mockProduct);
        const expected = await controller.update(mockProduct.id, mockProduct);
        expect(productService.update).toHaveBeenCalledWith(mockProduct.id, mockProduct);
        expect(productService.update).toHaveBeenCalledTimes(1);
        expect(expected).toEqual(HttpResponseMapper.map(mockProduct));
    });

    it('should call productService.delete with correct parameters', async () => {
        await controller.delete(mockProduct.id);
        expect(productService.delete).toHaveBeenCalledWith(mockProduct.id);
        expect(productService.delete).toHaveBeenCalledTimes(1);
    });

    it('should call productService.findByName with correct parameters and return the result', async () => {
        mockProductService.findByName.mockResolvedValue(mockProduct);
        const expected = await controller.findByName(mockProduct.name);
        expect(productService.findByName).toHaveBeenCalledWith(mockProduct.name);
        expect(productService.findByName).toHaveBeenCalledTimes(1);
        expect(expected).toEqual(HttpResponseMapper.map(mockProduct));
    });

    it('should call productService.findByCategory with correct parameters and return the result', async () => {
        mockProductService.findByCategory.mockResolvedValue([mockProduct]);
        const page = 1;
        const limit = 10;
        const expected = await controller.findByCategory(mockProduct.category, { page, limit });
        expect(productService.findByCategory).toHaveBeenCalledWith(
            mockProduct.category,
            page,
            limit,
        );
        expect(productService.findByCategory).toHaveBeenCalledTimes(1);
        expect(expected).toEqual(HttpResponseMapper.map([mockProduct]));
    });

    it('should call productService.findByBrand with correct parameters and return the result', async () => {
        mockProductService.findByBrand.mockResolvedValue([mockProduct]);
        const page = 1;
        const limit = 10;
        const expected = await controller.findByBrand(mockProduct.brand, { page, limit });
        expect(productService.findByBrand).toHaveBeenCalledWith(mockProduct.brand, page, limit);
        expect(productService.findByBrand).toHaveBeenCalledTimes(1);
        expect(expected).toEqual(HttpResponseMapper.map([mockProduct]));
    });
});
