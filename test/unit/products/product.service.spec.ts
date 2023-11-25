import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProductService } from '../../../src/application/products/product.service';
import { ProductRepository } from '../../../src/db/repository/product.repository';
import { ProductBuilder } from '../../builders/product.builder';
import { mockConfigService } from '../../mocks/configuration.service.mock';
import { mockLogger } from '../../mocks/logger.mock';
import { mockProductRepository } from '../../mocks/product.repository.mock';

describe('ProductService', () => {
    let productService: ProductService;

    const mockProduct = new ProductBuilder().build();
    const productDocument = new ProductBuilder();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: ProductRepository, useValue: mockProductRepository },
                { provide: 'ConfigurationService', useValue: mockConfigService() },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
            ],
        })
            .overrideProvider(ProductRepository)
            .useValue(mockProductRepository)
            .overrideProvider('ConfigurationService')
            .useValue(mockConfigService())
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .compile();

        productService = module.get<ProductService>(ProductService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a product', async () => {
        mockProductRepository.createProduct.mockResolvedValue(productDocument);
        const result = await productService.create(mockProduct);

        expect(mockProductRepository.createProduct).toHaveBeenCalledWith(mockProduct);
        expect(result).toEqual(mockProduct);
    });

    it('should find all products', async () => {
        mockProductRepository.findAllProducts.mockResolvedValue([productDocument]);
        const page = 1;
        const limit = 10;

        const result = await productService.findAll(page, limit);

        expect(mockProductRepository.findAllProducts).toHaveBeenCalledWith(page, limit);
        expect(result[0]).toEqual(mockProduct);
    });

    it('should find a product by name', async () => {
        mockProductRepository.findProductByName.mockResolvedValue(productDocument);
        const result = await productService.findByName(mockProduct.name);

        expect(mockProductRepository.findProductByName).toHaveBeenCalledWith(mockProduct.name);
        expect(result).toEqual(mockProduct);
    });

    it('should find products by category', async () => {
        mockProductRepository.findProductsByCategory.mockResolvedValue([productDocument]);
        const page = 1;
        const limit = 10;

        const result = await productService.findByCategory(mockProduct.category, page, limit);

        expect(mockProductRepository.findProductsByCategory).toHaveBeenCalledWith(
            mockProduct.category,
            page,
            limit,
        );
        expect(result[0]).toEqual(mockProduct);
    });

    it('should find products by brand', async () => {
        mockProductRepository.findProductsByBrand.mockResolvedValue([productDocument]);
        const page = 1;
        const limit = 10;

        const result = await productService.findByBrand(mockProduct.brand, page, limit);

        expect(mockProductRepository.findProductsByBrand).toHaveBeenCalledWith(
            mockProduct.brand,
            page,
            limit,
        );
        expect(result).toEqual([mockProduct]);
    });

    it('should throw an error when product is not found', async () => {
        mockProductRepository.findProductById.mockResolvedValue(null);
        await expect(productService.findById(mockProduct.id)).rejects.toThrow('Product not found');
    });
});
