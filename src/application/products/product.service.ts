import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductCategoryEnum } from 'src/types/product.category.enum';
import { ProductRepository } from '../../db/repository/product.repository';
import { Product } from '../../db/schemas/product.schema';
import { CreateProductDto } from './dto/product.create.dto';
import { UpdateProductDto } from './dto/product.update.dto';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async create(product: CreateProductDto): Promise<Product> {
        const createProduct = await this.productRepository.createProduct(product as Product);
        return createProduct.toObject();
    }

    async findAll(page: number, limit: number): Promise<Product[]> {
        const products = await this.productRepository.findAllProducts(page, limit);
        return products.map(product => product.toObject());
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productRepository.findProductById(id);
        if (!product) {
            throw new BadRequestException('Product not found');
        }
        return product.toObject();
    }

    async update(id: string, product: UpdateProductDto): Promise<Product> {
        const updatedProduct = await this.productRepository.updateProduct(id, product);
        if (!updatedProduct) {
            throw new BadRequestException('Product not found');
        }
        return updatedProduct.toObject();
    }

    async delete(id: string): Promise<void> {
        const deletedProduct = await this.productRepository.deleteProduct(id);
        if (!deletedProduct) {
            throw new BadRequestException('Product not found');
        }
    }

    async findByName(name: string): Promise<Product> {
        const product = await this.productRepository.findProductByName(name);
        if (!product) {
            throw new BadRequestException('Product not found');
        }
        return product.toObject();
    }

    async findByCategory(
        category: ProductCategoryEnum,
        page: number,
        limit: number,
    ): Promise<Product[]> {
        const products = await this.productRepository.findProductsByCategory(category, page, limit);
        return products.map(product => product.toObject());
    }

    async findByBrand(brand: string, page: number, limit: number): Promise<Product[]> {
        const products = await this.productRepository.findProductsByBrand(brand, page, limit);
        return products.map(product => product.toObject());
    }
}
